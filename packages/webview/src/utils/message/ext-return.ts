import type { MessageAPI } from "./MessageAPI.ts";
import type { Extension, JSONValue } from "./types.ts";
import c from "chalk";
import { logger } from "./logger.ts";

type ReturnHandler = {
  id: string;
  resolve: (data: any) => any;
  reject: (error: any) => any;
  promise: Promise<any>;
};
type ReturnData = { error: any; data: any };

export type ReturnAPI = {
  promiseReturn(id: string, callback: () => unknown): Promise<any>;
  postReturn(id: string, callback: () => any): Promise<void>;
};

export const createReturnExtension = (
  api: MessageAPI,
): Extension<"return", ReturnData, ReturnAPI> => {
  const map: Map<string, ReturnHandler> = new Map();
  const NOOP = () => void 0;

  return {
    type: "return",
    handleMessage,
    onDestroy() {
      map.clear();
    },
    api: {
      postReturn,
      promiseReturn,
    },
  };

  async function promiseReturn(id: string, callback: () => unknown) {
    if (map.has(id)) {
      console.warn(`[${id}] ReturnHandler has already been registered`);
      return;
    }
    const ref: ReturnHandler = {
      id,
      resolve: NOOP,
      reject: NOOP,
      promise: null as any,
    };
    ref.promise = new Promise((resolve, reject) => {
      ref.resolve = resolve;
      ref.reject = reject;
      callback();
    });
    map.set(id, ref);
    return ref.promise;
  }

  async function postReturn(id: string, callback: () => any) {
    let message: JSONValue;
    try {
      const data = await callback();
      message = {
        $id: id,
        $type: "return",
        $data: { error: null, data },
      };
    } catch (error) {
      message = {
        $id: id,
        $type: "return",
        $data: { error, data: null },
      };
    }
    api.postMessage(message);
  }

  async function handleMessage(id: string, _, data: ReturnData) {
    logger.log(c.grey(id), `return -`, data.error ?? data.data);

    const handler = map.get(id);
    if (!handler) {
      logger.warn(`ReturnHandler not found - ${id}`, data);
      return;
    }
    if (data.error) {
      handler.reject(data.error);
    } else {
      handler.resolve(data.data);
    }
    await handler.promise;
    map.delete(id);
  }
};
