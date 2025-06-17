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
const env = "./main/.env";
const exe = `${dist}/run.exe`;
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
    `--outfile=${exe}`,
    // todo .env
    // `--env-file=${env}`,
  ],
  { stdout: "inherit" },
);

// edit - executable file
// hideCommand(exe);
