import type { MessageAPI } from "./MessageAPI.ts";
import type { Extension } from "./types.ts";
import { logger } from "./logger.ts";
import c from "chalk";

type Listener = (type: string, ...args: any[]) => any;
type EmitHandler = { type: string; listeners: Set<{ listener: Listener }> };
type EmitData = { type: string; args: any[] };
export type EmitAPI = {
  emit(type: string, ...args: any[]): Promise<void>;
  on(type: string, listener: Listener): void;
  off(listener?: Listener): void;
  off(type?: string, listener?: Listener): void;
};

export const createEmitExtension = (
  api: MessageAPI,
): Extension<"emit", EmitData, EmitAPI> => {
  const map: Map<string, EmitHandler> = new Map();

  return {
    type: "emit",
    handleMessage,
    onDestroy() {
      map.clear();
    },
    api: { emit, on, off },
  };

  async function handleMessage(id: string, _: "emit", data: EmitData) {
    logger.log(c.grey(id), c.grey(`emit:${data.type}`), ...data.args);
    await api.postReturn(id, () => void 0);

    const handler = map.get(data.type);
    if (handler) {
      const { type, args } = data;
      const set = handler.listeners;
      set.forEach((x) => x.listener(type, ...args));
    }
  }

  async function emit(type: string, ...args: any[]) {
    const id = api.uuid();
    return await api.promiseReturn(id, () =>
      api.postMessage({ $id: id, $type: "emit", $data: { type, args } }),
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
      logger.warn(
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
};
