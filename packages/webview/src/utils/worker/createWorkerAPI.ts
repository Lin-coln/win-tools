import { type MessageData, MessageAPI } from "./MessageAPI.ts";
import c from "chalk";
import { registerCleanup } from "../cleanup.ts";
import { isMainThread } from "worker_threads";

const logger = {
  log(...args: any[]) {
    console.log(c.grey(`[worker]`.padEnd(8)), ...args);
  },
};
const internalProps = ["worker", "emit", "on", "off"];

class WorkerMessageAPI extends MessageAPI {
  worker: Worker;
  constructor(worker: Worker) {
    super();
    this.worker = worker;

    worker.addEventListener("close", () => this.onDestroy());
    worker.addEventListener("message", async (event) => {
      const data: MessageData = event.data;
      await this.onReceiveMessage(data);
    });
  }

  protected postMessage(message: MessageData) {
    this.worker.postMessage(message);
  }
}

type Handlers = Record<string, Parameters<MessageAPI["handle"]>[1]>;
declare const self: Worker;

export { create as createWorkerAPI };

type API<T> = Promise<WorkerMessageAPI & T>;
type APIOptions = {
  create?: { url: string | URL; options?: Bun.WorkerOptions };
  handlers?: Handlers;
};
async function create<Invoker>(url?: string, handlers?: Handlers): API<Invoker>;
async function create<Invoker>(opts: APIOptions): API<Invoker>;
async function create<Invoker>(
  a?: string | APIOptions,
  b?: Handlers,
): API<Invoker> {
  // resolve args
  const opts: APIOptions = {};
  if (a) {
    if (typeof a === "string") {
      opts.create = { url: a };
    } else if (typeof a === "object") {
      Object.assign(opts, a);
    }
  }
  if (b) {
    opts.handlers = b as Handlers;
  }

  // get worker
  let worker: Worker;
  if (opts.create) {
    const { url, options = {} } = opts.create;
    worker = await new Promise<Worker>((resolve, reject) => {
      const worker = new Worker(url, options);
      worker.addEventListener(
        "open",
        (e) => {
          logger.log(c.grey("open"));
          resolve(worker);
        },
        { once: true },
      );
      worker.addEventListener(
        "error",
        (e) => {
          logger.log(c.red("error"), e.message);
          reject(e.message);
        },
        { once: true },
      );
    });
    registerCleanup(() => worker.terminate());
  } else if (!isMainThread) {
    worker = self;
  } else {
    throw new Error(`failed to get worker`);
  }

  // create invoker
  const handlers = opts.handlers ?? {};
  const api = new WorkerMessageAPI(worker);
  Object.entries(handlers).forEach((x) => api.handle(...x));
  const invoker = new Proxy(api, {
    get: (tar, prop: string, receiver) => {
      if (internalProps.includes(prop)) {
        return Reflect.get(tar, prop, receiver);
      }

      if (api.returnMap.has(prop)) {
        return (...args: any[]) => api.invoke(prop, ...args);
      }

      return void 0;
    },
  });

  return invoker as any;
}
