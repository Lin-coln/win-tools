import c from "chalk";
import { isMainThread } from "worker_threads";

const noop = () => void 0;
const isWorker = !isMainThread;
const local = isWorker ? "worker" : "main";
const remote = isWorker ? "main" : "worker";
const logger = {
  log(...args: any[]) {
    console.log(c.grey(`[${local}]`.padEnd(8)), ...args);
  },
};

type Handler = (...args: any[]) => any;
type ReturnHandler = {
  id: string;
  resolve: (result: any) => unknown;
  reject: (error: any) => unknown;
};
type ReturnData = { result: any; error: any };

type InvokeHandler = { name: string; handle: Handler };
type InvokeData = { name: string; args: any[] };

type EmitHandler = { type: string; listeners: Set<Handler> };
type EmitData = { type: string; args: any[] };

export type MessageData =
  | { $type: "return"; $id: string; $data: ReturnData }
  | { $type: "invoke"; $id: string; $data: InvokeData }
  | { $type: "emit"; $id: string; $data: EmitData };

export abstract class MessageAPI {
  returnMap: Map<string, ReturnHandler>;
  invokeMap: Map<string, InvokeHandler>;
  listenerMap: Map<string, EmitHandler>;

  protected uuid() {
    return `${Math.random().toString(36).slice(2).padStart(4, "0")}`;
  }

  protected abstract postMessage(message: MessageData): void;
  protected async onReceiveMessage(data: MessageData) {
    const { $type, $id, $data } = data;

    // return
    if ($type === "return") {
      await handleReturn.call(this, $id, $data);
    }
    // invoke
    else if ($type === "invoke") {
      await handleInvoke.call(this, $id, $data);
    }
    // emit
    else if ($type === "emit") {
      await handleEmit.call(this, $id, $data);
    }
  }
  protected onDestroy() {
    this.invokeMap.clear();
    this.returnMap.clear();
    this.listenerMap.clear();
  }

  protected constructor() {
    this.returnMap = new Map();
    this.invokeMap = new Map();
    this.listenerMap = new Map();
  }

  public async return(id: string, callback: () => any) {
    let $data: ReturnData;
    try {
      const result = await callback();
      $data = { result, error: null };
    } catch (error) {
      $data = { result: void 0, error };
    }
    this.postMessage({ $type: "return", $id: id, $data });
  }

  public async invoke(name: string, ...args: any[]): Promise<any> {
    const returnMap = this.returnMap;
    const $id = this.uuid();
    const ref: ReturnHandler = { id: $id, resolve: noop, reject: noop };
    returnMap.set($id, ref);
    return await new Promise((resolve, reject) => {
      ref.resolve = resolve;
      ref.reject = reject;
      this.postMessage({ $type: "invoke", $id, $data: { name, args } });
    });
  }
  public handle(name: string, handle: Handler) {
    const invokeMap = this.invokeMap;
    if (invokeMap.has(name)) {
      logger.log(`Failed to handle registered invoke - ${name}`);
    } else {
      invokeMap.set(name, { name, handle });
    }
    return this;
  }

  public async emit(type: string, ...args: any[]): Promise<void> {
    const returnMap = this.returnMap;
    const $id = this.uuid();
    const ref: ReturnHandler = { id: $id, resolve: noop, reject: noop };
    returnMap.set($id, ref);
    return await new Promise((resolve, reject) => {
      ref.resolve = resolve;
      ref.reject = reject;
      this.postMessage({ $type: "emit", $id, $data: { type, args } });
    });
  }
  public on(type: string, listener: Handler): this {
    let handler = this.listenerMap.get(type);
    if (!handler) {
      handler = { type, listeners: new Set() };
      this.listenerMap.set(type, handler);
    }

    const { listeners } = handler;
    if (listeners.has(listener)) {
      logger.log(`Failed to add listener - existed`);
    } else {
      listeners.add(listener);
    }
    return this;
  }
  public off(): this;
  public off(type: string): this;
  public off(listener: Handler): this;
  public off(type: string, listener: Handler): this;
  public off(typeOrListener?: string | Handler, listener?: Handler): this {
    let type: string | void;
    if (typeof typeOrListener === "string") {
      type = typeOrListener;
    } else if (typeof typeOrListener === "function") {
      type = void 0;
      listener = typeOrListener;
    } else {
      type = void 0;
      listener = void 0;
    }

    if (!type && !listener) {
      this.listenerMap.clear();
    } else if (type && !listener) {
      this.listenerMap.get(type)?.listeners.clear();
    } else if (!type && listener) {
      this.listenerMap
        .values()
        .forEach((handler) => handler.listeners.delete(listener));
    } else if (type && listener) {
      this.listenerMap.get(type)?.listeners.delete(listener);
    }

    return this;
  }
}

async function handleReturn(this: MessageAPI, id: string, data: ReturnData) {
  const returnMap = this.returnMap;
  const { result, error } = data;

  logger.log(c.grey(`msg:${id}`), `return -`, error ?? result);

  const handler = returnMap.get(id);
  if (!handler) {
    logger.log(`ReturnHandler not found for Received message - ${id}`);
    return;
  }

  if (error) {
    handler.reject(error);
  } else {
    handler.resolve(result);
  }
}

async function handleInvoke(this: MessageAPI, id: string, data: InvokeData) {
  const invokeMap = this.invokeMap;
  const { name, args } = data;

  logger.log(c.grey(`msg:${id}`), `invoke - ${name}`, ...args);

  const handler = invokeMap.get(name);
  if (!handler) {
    logger.log(`InvokeHandler not found for Received message - ${name}`);
    return;
  }

  await this.return(id, () => handler.handle(...args));
}

async function handleEmit(this: MessageAPI, id: string, data: EmitData) {
  const { type, args } = data;

  logger.log(c.grey(`msg:${id}`), c.grey(`emit:${type}`), ...args);

  const handler = this.listenerMap.get(type);
  const handlers = Array.from(handler?.listeners.values() ?? []);
  await this.return(id, () => handlers.forEach((fn) => fn(...args)));
}
