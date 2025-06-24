import { Webview } from "../utils/webview.ts";
import { appName } from "../utils/constants.ts";
import { createWorkerAPI } from "../utils/worker/api.ts";

declare const self: Worker;

const webview = new Webview(true);
export const handlers = { createWindow } as const;
const api = await createWorkerAPI(self, { handlers });

async function createWindow(opts: { url: string }) {
  const { url } = opts;
  console.log("createWindow", url);
  webview.title = appName;

  // todo preload
  webview.init(`window.bun = true`);

  webview.navigate(url);
  webview.run();
}
