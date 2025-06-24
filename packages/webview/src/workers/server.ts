import { createWorkerAPI } from "../utils/worker/api.ts";
import { createServer } from "../server";

declare const self: Worker;

export const handlers = { createServer } as const;
const api = await createWorkerAPI(self, { handlers });
