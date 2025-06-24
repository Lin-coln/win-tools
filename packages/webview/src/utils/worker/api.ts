import { type EmitAPI } from "../message";
import { isMainThread } from "node:worker_threads";
import { WorkerMessageAPI } from "./WorkerMessageAPI.ts";

type Handlers = Record<string, (...args: any[]) => any>;
export type WorkerAPI<T extends Handlers> = EmitAPI & {
  readonly worker: Worker;
} & {
  [key in keyof T]: (
    ...args: Parameters<T[key]>
  ) => Promise<Awaited<ReturnType<T[key]>>>;
};

export { createWorkerAPI };

type CreateOptions = Bun.WorkerOptions & { handlers?: Handlers };

async function createWorkerAPI<T extends Handlers>(
  opts?: CreateOptions,
): Promise<WorkerAPI<T>>;
async function createWorkerAPI<T extends Handlers>(
  worker?: Worker,
  opts?: CreateOptions,
): Promise<WorkerAPI<T>>;
async function createWorkerAPI<T extends Handlers>(
  url?: string,
  opts?: CreateOptions,
): Promise<WorkerAPI<T>>;
async function createWorkerAPI<T extends Handlers>(
  a?: string | Worker | CreateOptions,
  b?: CreateOptions,
): Promise<WorkerAPI<T>> {
  // resolve args
  let worker!: Worker;
  let url: string | undefined;
  let opts: CreateOptions = {};
  if (typeof a === "string") {
    url = a;
  } else if (a === globalThis && !isMainThread) {
    worker = a as any;
  } else if (a && typeof a === "object") {
    opts = a as CreateOptions;
  }
  if (b) {
    opts = b;
  }
  const { handlers = {}, ...workerOpts } = opts;

  // create worker
  if (url) {
    worker = await new Promise((resolve, reject) => {
      const worker = new Worker(url, workerOpts);
      worker.addEventListener("open", () => resolve(worker), { once: true });
      worker.addEventListener("error", (event) => reject(event.error), {
        once: true,
      });
    });

    process.on("SIGINT", () => worker.terminate());
    process.on("SIGTERM", () => worker.terminate());
  }

  if (!worker) {
    throw new Error("worker not found");
  }

  // create api
  const api = new WorkerMessageAPI(worker);
  const exported = api.export();
  Object.entries(handlers).forEach(([name, handler]) => {
    exported.handle(name, handler);
  });
  const proxy = new Proxy(api, {
    get(_, p: string, __) {
      if (["then"].includes(p)) return void 0;

      if ("worker" === p) return api.worker;
      if (["emit", "on", "off", "once"].includes(p)) return exported[p];

      return (...args: any[]) => exported.invoke(p, ...args);
    },
  });
  return proxy as any;
}
