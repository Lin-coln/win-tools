import fs from "node:fs";
import Bun from "bun";
// import { hideCommand } from "./hideCommand.ts";

const dist = "./dist";
await fs.promises.rm(dist, { recursive: true, force: true });

// build - view
const view = `${dist}/view`;
await Bun.build({
  outdir: view,
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
    ...["./main/run.ts", "./main/worker.ts"],
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
