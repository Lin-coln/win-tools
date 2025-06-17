import { isMainThread } from "worker_threads";

type InvokeHandler = {
  name: string;
  handle: (...args: any[]) => any;
};
type ReturnHandler = {
  id: string;
  resolve: (result: any) => unknown;
  reject: (error: any) => unknown;
};

type PubSubMessageData =
  | { type: "invoke"; id: string; name: string; args: any[] }
  | { type: "return"; id: string; result: any; error: any };

export function createIpc(worker: Worker) {
  const isWorker = !isMainThread;
  const noop = () => void 0;

  const local = isWorker ? "worker" : "main";
  const remote = isWorker ? "main" : "worker";

  const invokeMap = new Map<string, InvokeHandler>();
  const returnMap = new Map<string, ReturnHandler>();

  worker.addEventListener("close", () => {
    invokeMap.clear();
    returnMap.clear();
  });

  worker.addEventListener("message", async (event) => {
    console.log("received message", event);

    const data: PubSubMessageData = event.data;

    // handle invoke
    if (data.type === "invoke") {
      const { id, name, args } = data;
      const handler = invokeMap.get(name);
      if (!handler) {
        console.warn(`InvokeHandler not found for Received message - ${name}`);
        return;
      }

      try {
        const result = await handler.handle(...args);
        worker.postMessage({ type: "return", id, result });
      } catch (error) {
        worker.postMessage({ type: "return", id, error });
      }
    }

    // receive result
    else if (data.type === "return") {
      const { id, result, error } = data;
      const handler = returnMap.get(id);
      if (!handler) {
        console.warn(`ReturnHandler not found for Received message - ${id}`);
        return;
      }

      if (error !== void 0) {
        handler.reject(error);
      } else {
        handler.resolve(result);
      }
    }
  });

  return { handle, invoke };

  function handle(name: string, handle: (...args: any[]) => any) {
    if (invokeMap.has(name)) {
      console.warn(`Failed to handle registered invoke - ${name}`);
      return;
    }
    invokeMap.set(name, { name, handle });
  }

  async function invoke(name: string, ...args: any[]): Promise<any> {
    const id = `uuid-${Math.random().toString(36).padStart(4, "0")}`;
    const ref: ReturnHandler = { id, resolve: noop, reject: noop };
    returnMap.set(id, ref);
    return await new Promise((resolve, reject) => {
      ref.resolve = resolve;
      ref.reject = reject;
      worker.postMessage({ type: "invoke", id, name, args });
    });
  }
}
