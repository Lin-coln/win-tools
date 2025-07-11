import type { MessageAPI } from "./MessageAPI.ts";
import type { Extension } from "./types.ts";
import { logger } from "./logger.ts";
import c from "chalk";
import util from "node:util";

type InvokeHandler = { name: string; callback: (...args: any[]) => any };
type InvokeData = { name: string; args: any[] };

export type InvokeAPI = {
  handle(name: string, callback: (...args: any[]) => any): void;
  invoke(name: string, ...args: any[]): Promise<any>;
};

export const createInvokeExtension = (
  api: MessageAPI,
): Extension<"invoke", InvokeData, InvokeAPI> => {
  const map: Map<string, InvokeHandler> = new Map();

  return {
    type: "invoke",
    handleMessage,
    onDestroy() {
      map.clear();
    },
    api: {
      handle,
      invoke,
    },
  };

  function handle(name: string, callback: (...args: any[]) => any) {
    if (map.has(name)) {
      logger.warn(
        `Failed to register invoke handler which is registered - ${name}`,
      );
      return;
    }
    map.set(name, { name, callback });
  }

  async function invoke(name: string, ...args: any[]) {
    const id = api.uuid();
    return await api.promiseReturn(id, () => {
      api.postMessage({ $id: id, $type: "invoke", $data: { name, args } });
    });
  }

  async function handleMessage(id: string, _: "invoke", data: InvokeData) {
    logger.log(
      c.grey(id),
      `invoke - ${data.name}`,
      ...data.args.map((x) => util.inspect(x, { depth: null })),
    );

    await api.postReturn(id, async () => {
      const { name, args } = data;
      const handler = map.get(name);
      if (!handler) {
        const msg = `Failed to invoke handler which is not found - ${name}`;
        logger.error(msg);
        throw new Error(msg);
      }
      return await handler.callback(...args);
    });
  }
};
