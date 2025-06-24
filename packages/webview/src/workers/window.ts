import { Webview } from "../utils/webview.ts";
import { createWorkerAPI } from "../utils/worker/api.ts";

declare const self: Worker;

const webview = new Webview(true);
export const handlers = { createWindow } as const;
const api = await createWorkerAPI(self, { handlers });

async function createWindow(opts: { url: string }) {
  const { url } = opts;
  console.log("createWindow", url);
  webview.title = "Bun";

  // todo preload
  webview.init(`window.bun = true`);

  webview.navigate(url);
  // webview.navigate("http://localhost:3001");
  // webview.navigate("https://bun.sh/");
  webview.run();
}
