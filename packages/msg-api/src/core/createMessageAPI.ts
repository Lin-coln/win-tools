import type { Protocol } from "./protocols/types";
import { createReturnProtocol, type ReturnAPI } from "./protocols/return.ts";
import { createEmitProtocol } from "./protocols/emit.ts";
import type { Binary } from "./types";

export namespace MessageAPI {
  export interface Options {
    identifier: string;
    initialize: (handleData: (bin: Binary) => Promise<void>) => Promise<void>;
    send: (dest: string, data: Binary) => Promise<void>;

    uuid: () => string;
    encode: (data: any) => Promise<Binary>;
    decode: (bin: Binary) => Promise<any>;
  }
}

export async function createMessageAPI(opts: MessageAPI.Options) {
  const identifier = opts.identifier;

  const protocols: Map<string, Protocol> = new Map();
  const ctx: Protocol.Context = {
    identifier,
    send,
    uuid: () => opts.uuid(),
    get return() {
      return (protocols.get("return")!.api as ReturnAPI).postReturn;
    },
    get await() {
      return (protocols.get("return")!.api as ReturnAPI).promiseReturn;
    },
  };

  // initialize
  const $return = createReturnProtocol(ctx);
  protocols.set($return.name, $return);
  const $emit = createEmitProtocol(ctx);
  protocols.set($emit.name, $emit);
  await opts.initialize(handleData);

  return {
    destroy,
    // api from $emit
    get emit() {
      return $emit.api.emit;
    },
    get on() {
      return $emit.api.on;
    },
    get off() {
      return $emit.api.off;
    },
  };

  function destroy() {
    Object.values(protocols)
      .reverse()
      .forEach((x: Protocol) => x.destroy());
    protocols.clear();
  }

  async function send(raw: Protocol.RawData) {
    const dest = raw.$dest;
    const bin = await opts.encode(raw);
    await opts.send(dest, bin);
  }

  async function handleData(bin: Binary) {
    const data: Protocol.RawData = await opts.decode(bin);
    if (!data.$type) {
      console.warn(`unhandled message`, data);
      return;
    }

    const protocol = protocols.get(data.$type);
    if (!protocol) {
      console.warn(`unhandled message (${data.$type})`, data);
      return;
    }

    await protocol.handleMessage({
      origin: data.$origin,
      dest: data.$dest,
      id: data.$id,
      data: data.$data,
    });
  }
}
