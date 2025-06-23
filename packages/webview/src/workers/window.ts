import { Webview } from "../utils/webview.ts";
import { createWorkerAPI } from "../utils/worker/createWorkerAPI.ts";

const webview = new Webview(true);
export const handlers = { createWindow } as const;
const api = await createWorkerAPI({ handlers });

async function createWindow(opts: { url: string }) {
  const { url } = opts;
  console.log("create Window", url);
  webview.title = "Bun";

  // todo preload
  webview.init(`window.bun = true`);

  webview.navigate(url);
  webview.run();
}
