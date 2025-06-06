import Bun from "bun";
import fs from "node:fs";

const dist = "../dist-preload";
await fs.promises.rm(dist, { recursive: true, force: true });

await Bun.build({
  root: ".",
  entrypoints: ["./preload.ts"],
  outdir: dist,
  target: "browser",
  format: "esm",
  splitting: true,
  sourcemap: "external",
  minify: false,
  naming: "index.js",
});
