import type { Protocol } from "./types";

type ReturnHandler = {
  id: string;
  resolve: (data: any) => any;
  reject: (error: any) => any;
  promise: Promise<any>;
};
type ReturnData = { error: any; data: any };

export type ReturnAPI = {
  promiseReturn(id: string, callback: () => unknown): Promise<any>;
  postReturn(receiver: string, id: string, callback: () => any): Promise<void>;
};

export function createReturnProtocol(
  ctx: Protocol.Context,
): Protocol<"return", ReturnData, ReturnAPI> {
  const map: Map<string, ReturnHandler> = new Map();
  const NOOP = () => void 0;

  return {
    name: "return",
    handleMessage,
    api: {
      promiseReturn,
      postReturn,
    },
    destroy() {
      map.clear();
    },
  };

  async function handleMessage(event: Protocol.MessageEvent<ReturnData>) {
    const { origin, dest, id, data } = event;
    console.log(id, `[${origin}]`, `return -`, data.error ?? data.data);

    const handler = map.get(id);
    if (!handler) {
      console.warn(`ReturnHandler not found - ${id}`, data);
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

  async function postReturn(dest: string, id: string, callback: () => any) {
    let raw: Protocol.RawData;
    try {
      const data = await callback();
      raw = {
        $origin: ctx.identifier,
        $dest: dest,
        $id: id,
        $type: "return",
        $data: { error: null, data },
      };
    } catch (error) {
      raw = {
        $origin: ctx.identifier,
        $dest: dest,
        $id: id,
        $type: "return",
        $data: { error, data: null },
      };
    }
    await ctx.send(raw);
  }
}
