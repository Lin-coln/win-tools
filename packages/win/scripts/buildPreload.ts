import Bun from "bun";
import fs from "node:fs";

const dist = "./dist-preload";
await fs.promises.rm(dist, { recursive: true, force: true });

await Bun.build({
  root: "./preload",
  entrypoints: ["./preload/index.ts"],
  outdir: dist,
  target: "browser",
  format: "esm",
  splitting: false,
  sourcemap: "external",
  minify: false,
  naming: "index.js",
});
