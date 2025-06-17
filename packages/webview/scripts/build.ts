import fs from "node:fs";
import Bun from "bun";
// import { hideCommand } from "./hideCommand.ts";

const dist = "./dist";
await fs.promises.rm(dist, { recursive: true, force: true });

// build - view
await Bun.build({
  outdir: dist,
  entrypoints: [`./view/index.html`],
  target: "browser",
  format: "esm",
  splitting: true,
  sourcemap: "external",
  minify: false,
});

// build - main
const platform = process.platform;
const env = "./main/.env";
const ext = platform === "darwin" ? ".app" : ".exe";
const filename = `${dist}/run${ext}`;
Bun.spawnSync(
  [
    "bun",
    "build",

    ...[
      // entries
      "./main/run.ts",
      "./main/workers/window.ts",
      // "./main/worker.ts",
      // "./main/workers/server.ts",
    ],
    "--minify",
    "--sourcemap",
    "--compile",
    `--outfile=${filename}`,
    // todo .env
    // `--env-file=${env}`,
  ],
  { stdout: "inherit" },
);

// edit - executable file
// hideCommand(exe);
// sign
