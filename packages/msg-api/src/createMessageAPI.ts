import type { Binary, Protocol } from "./types";
import { createReturnProtocol, type ReturnAPI } from "./protocols/return.ts";
import { createEmitProtocol } from "./protocols/emit.ts";

interface Options {
  identifier: string;
  listen: (callback: (bin: Binary) => Promise<void>) => void;
  postMessage: (receiver: string, data: Binary) => Promise<void>;
  uuid: () => string;
  encode: (data: any) => Promise<Binary>;
  decode: (bin: Binary) => Promise<any>;
}

function createMessageAPI(opts: Options) {
  const identifier = opts.identifier;
  const protocols: Map<string, Protocol> = new Map();
  const ctx: Protocol.Context = {
    identifier,
    postMessage,
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

  opts.listen(handleMessage);

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

  async function postMessage(raw: Protocol.RawData) {
    const bin = await opts.encode(raw);
    await opts.postMessage(raw.$receiver, bin);
  }

  async function handleMessage(bin: Binary) {
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
      sender: data.$sender,
      receiver: data.$receiver,
      id: data.$id,
      data: data.$data,
    });
  }
}
