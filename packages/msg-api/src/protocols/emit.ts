import type { Protocol } from "../types";

type Listener = (type: string, ...args: any[]) => any;
type EmitHandler = { type: string; listeners: Set<{ listener: Listener }> };
type EmitData = { type: string; args: any[] };
type EmitAPI = {
  emit(receiver: string, type: string, ...args: any[]): Promise<void>;
  on(type: string, listener: Listener): void;
  off(listener?: Listener): void;
  off(type?: string, listener?: Listener): void;
};

export function createEmitProtocol(
  ctx: Protocol.Context,
): Protocol<"emit", EmitData, EmitAPI> {
  const map: Map<string, EmitHandler> = new Map();

  return {
    name: "emit",
    handleMessage,
    api: { emit, on, off },
    destroy() {
      map.clear();
    },
  };

  async function handleMessage(event: Protocol.MessageEvent<EmitData>) {
    const { sender, id, data } = event;
    console.log(id, `[${sender}]`, `emit:${data.type}`, ...data.args);
    await ctx.return(sender, id, () => void 0);

    const handler = map.get(data.type);
    if (!handler) return;
    const { type, args } = data;
    const set = handler.listeners;
    set.forEach((x) => x.listener(type, ...args));
  }

  async function emit(receiver: string, type: string, ...args: any[]) {
    const id = ctx.uuid();
    return await ctx.await(id, () =>
      ctx.postMessage({
        $sender: ctx.identifier,
        $receiver: receiver,
        $id: id,
        $type: "emit",
        $data: { type, args },
      }),
    );
  }

  function on(type: string, listener: Listener) {
    let handler = map.get(type);
    if (!handler) {
      handler = { type, listeners: new Set() };
      map.set(type, handler);
    }

    const existed = Array.from(handler.listeners).some(
      (x) => x.listener === listener,
    );
    if (existed) {
      console.warn(
        `Failed to add listener which is already existed - ${type}`,
        listener.name,
      );
      return;
    }

    handler.listeners.add({ listener });
  }

  function off(a?: string | Listener, b?: Listener) {
    // resolve args
    let type: string | undefined;
    let listener: Listener | undefined;
    if (typeof a === "string") {
      type = a;
    } else if (typeof a === "function") {
      listener = a;
    }
    if (typeof b === "function") {
      listener = b;
    }

    // off
    if (!type && !listener) {
      map.clear();
    } else if (type && !listener) {
      map.delete(type);
    } else if (!type && listener) {
      map.values().forEach((handler) => {
        handler.listeners.values().forEach((item) => {
          if (item.listener !== listener) return;
          handler.listeners.delete(item);
        });
      });
    } else if (type && listener) {
      const handler = map.get(type);
      if (!handler) return;
      handler.listeners.values().forEach((item) => {
        if (item.listener !== listener) return;
        handler.listeners.delete(item);
      });
    }
  }
}
