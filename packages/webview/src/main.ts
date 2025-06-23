import { getWorkerUrl } from "./utils/constants.ts";
import { createWorkerAPI } from "./utils/worker/createWorkerAPI.ts";
import type { handlers as windowHandler } from "./workers/window.ts";

await main();
async function main() {
  try {
    await initialize();
    await createServer();
    await createWindow();

    await new Promise<void>((resolve) => {
      let x: number = 3;
      const timeout = setInterval(() => {
        if (x === 0) {
          clearInterval(timeout);
          resolve();
          return;
        }
        console.log(`quiting... (${x})`);
        x--;
      }, 1000);
    });
    process.exit(0);
  } catch (e) {
    console.error(e);
    await wait(180_000);
  }

  async function wait(duration: number) {
    await new Promise((resolve) => setTimeout(resolve, duration));
  }
}

async function initialize() {
  console.log("embeddedFiles", Bun.embeddedFiles);
}

async function createServer() {
  const url = getWorkerUrl("./workers/server.ts");
  const api = await createWorkerAPI(url);
}

async function createWindow() {
  const url = getWorkerUrl("./workers/window.ts");
  const api = await createWorkerAPI<typeof windowHandler>(url);
  await api.createWindow({
    // url: "https://bun.sh/"
    url: "http://localhost:3001",
  });
  api.worker.terminate();
}
