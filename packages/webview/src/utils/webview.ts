import { getPackagedPath, isPackaged } from "./constants.ts";

if (isPackaged) {
  const file = (Bun.embeddedFiles as (Blob & { name: string })[]).find((x) =>
    x.name.includes("/libwebview."),
  );
  if (!file) throw new Error("embeddedFile libwebview not found");
  process.env.WEBVIEW_PATH = getPackagedPath(`./${file.name}`);
}
export const Webview = await import("webview-bun").then((x) => x.Webview);
