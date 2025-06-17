import { createIpc } from "../utils/worker.ts";

declare const self: Worker;

import { Webview } from "webview-bun";

const webview = new Webview(true);

const { handle, invoke } = createIpc(self);

handle("createWindow", async (opts: { url: string }) => {
  const { url } = opts;

  console.log("create Window", url);
  webview.title = "Bun";
  webview.navigate(url);
  webview.run();
});
