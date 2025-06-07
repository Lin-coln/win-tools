import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export const PRELOAD_FILENAME = path.resolve(
  __dirname,
  "../../dist-preload/index.js",
);
export const INDEX_FILENAME = path.resolve(
  __dirname,
  "../../dist-renderer/index.html",
);

export const APP_ARGS: Record<string, string | number | boolean> =
  Object.fromEntries(
    process.argv
      .slice(2)
      .filter((x) => x.startsWith("--"))
      .map((x) => {
        const [k, v] = x.split("=");
        return [k!.slice(2), v ? JSON.parse(v) : true];
      }),
  );

console.log({ APP_ARGS });
