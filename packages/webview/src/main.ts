import { getWorkerUrl } from "./utils/constants.ts";
import { createWorkerAPI } from "./utils/worker/createWorkerAPI.ts";
import type { handlers as windowHandler } from "./workers/window.ts";
import type { handlers as serverHandler } from "./workers/server.ts";

await main();
async function main() {
  try {
    await initialize();

    const server = await createWorkerAPI<typeof serverHandler>(
      getWorkerUrl("./workers/server.ts"),
    );
    const window = await createWorkerAPI<typeof windowHandler>(
      getWorkerUrl("./workers/window.ts"),
    );

    const url = await server.createServer();
    await window.createWindow({ url });
    window.worker.terminate();

    await count(3, (x) => console.log(`quiting... (${x})`));
    process.exit(0);
  } catch (e) {
    console.error(e);
    await wait(180_000);
  }
}

async function initialize() {
  console.log("embeddedFiles", Bun.embeddedFiles);
}

async function wait(duration: number) {
  await new Promise((resolve) => setTimeout(resolve, duration));
}

async function count(duration: number, callback: (time: number) => void) {
  await new Promise<void>((resolve) => {
    let x: number = duration;
    const timeout = setInterval(() => {
      if (x === 0) {
        clearInterval(timeout);
        resolve();
        return;
      }
      callback(x);
      x--;
    }, 1000);
  });
}
