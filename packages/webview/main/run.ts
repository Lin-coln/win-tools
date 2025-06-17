import { getAppPath, getWorkerPath } from "./utils/constants.ts";
import { createIpc } from "./utils/worker.ts";

// const server = Bun.serve({
//   routes: {
//     "/": index,
//   },
//   port: 3001,
//   development: process.env.NODE_ENV !== "production" && {
//     hmr: true,
//     console: true,
//   },
// });

// try {
//   console.log(Bun.embeddedFiles);
//
//   const env = Object.fromEntries(
//     Object.entries({
//       PORT,
//       APP_PATH,
//       APP_PACKAGED,
//     }).map((x) => [x[0], JSON.stringify(x[1])]),
//   );
//
//   // const server = new Worker(getWorkerPath("./workers/server.ts"), { env });
//
//   const url = getWorkerPath("./workers/window.ts");
//   console.log(url);
//   const window = new Worker(getWorkerPath("./workers/window.ts"), { env });
//   await new Promise((resolve) => setTimeout(resolve, 10_000));
// } catch (e) {
//   console.log(e);
//   await new Promise((resolve) => setTimeout(resolve, 10_000));
// }

await main();
async function main() {
  try {
    await initialize();
    await createWindow();

    await wait(100_000);
  } catch (e) {
    console.error(e);
    await wait(10_000);
  }

  async function wait(duration: number) {
    await new Promise((resolve) => setTimeout(resolve, duration));
  }
}

async function initialize() {
  console.log("embeddedFiles", Bun.embeddedFiles);
  console.log("import.meta", import.meta);

  /**
   * extract libwebview.dll
   */
  const blob = (Bun.embeddedFiles as (Blob & { name: string })[]).find((x) =>
    x.name.startsWith("libwebview"),
  )!;
  const filename = getAppPath(`./${blob.name}`);
  const file = Bun.file(filename);
  if (!(await file.exists())) {
    await file.write(await blob.arrayBuffer());
  }
  import.meta.env.WEBVIEW_PATH = filename;
}

async function createWindow() {
  const filename = getWorkerPath("./workers/window.ts");
  const env = {
    WEBVIEW_PATH: import.meta.env.WEBVIEW_PATH!,
  };

  const worker = await new Promise<Worker>((resolve, reject) => {
    const worker = new Worker(filename, { env });
    worker.addEventListener(
      "open",
      (e) => {
        console.log("worker open", e);
        resolve(worker);
      },
      { once: true },
    );
    worker.addEventListener(
      "error",
      (e) => {
        console.log("worker error", e.message);
        reject(e.message);
      },
      { once: true },
    );
  });

  const { invoke, handle } = createIpc(worker);

  await invoke("createWindow", { url: "https://www.google.com" });

  worker.terminate();
}
