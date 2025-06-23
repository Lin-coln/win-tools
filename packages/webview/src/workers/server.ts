import { createWorkerAPI } from "../utils/worker/createWorkerAPI";
import Index from "../pages/index.html";

let server: Bun.Server;
export const handlers = { createServer } as const;
const api = await createWorkerAPI({ handlers });

async function createServer() {
  const port = 3001;
  server = Bun.serve({
    port,
    routes: {
      "/*": Index,
      "/api/*": new Response("api from worker"),
    },
    development: process.env.NODE_ENV !== "production" && {
      hmr: true,
      console: true,
    },
  });
  console.log(`🚀 Server running at ${server.url}`);

  return `http://localhost:${port}`;
}
