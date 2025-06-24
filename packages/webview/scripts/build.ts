import fs from "node:fs";
import Bun, { type BuildConfig } from "bun";
import path from "node:path";

// cleanup
const dist = "./dist";
await fs.promises.rm(dist, { recursive: true, force: true });

// build - main
const compiled = process.argv.includes("--compile");
const platform = process.platform;

const config: BuildConfig = {
  outdir: dist,
  entrypoints: [
    // entry
    "./src/main.ts",

    // "./src/workers/*.ts",
    ...(await Promise.resolve().then(async () => {
      const dir = "./src/workers";
      const files = await fs.promises.readdir(dir);
      return files
        .filter((x) => x.endsWith(".ts"))
        .map((x) => "./" + path.join(dir, x).replace(/\\/g, "/"));
    })),
  ],
  target: "bun",
  format: "esm",
  splitting: true,
  sourcemap: "external",
  minify: false,
  naming: {
    entry: "[dir]/[name].[ext]",
    chunk: "chunks/[name]-[hash].[ext]",
    asset: "resources/[name].[ext]",
  },
};
if (!compiled) {
  await Bun.build(config);
} else {
  const ext = platform === "darwin" ? "" : ".exe";
  const filename = `${dist}/main${ext}`;
  const iconFilename = "./resources/icon.ico";

  /**
   * bun build --compile --target=bun-windows-x64 ./path/to/my/app.ts --outfile myapp
   */
  Bun.spawnSync(
    [
      "bun",
      "build",
      ...config.entrypoints,
      "--minify",
      "--sourcemap",
      "--compile",
      `--outfile=${filename}`,

      `--entry-naming=${(config.naming as any).entry}`,
      `--chunk-naming=${(config.naming as any).chunk}`,
      `--asset-naming=${(config.naming as any).asset}`,
      ...(platform === "win32"
        ? [
            // not working
            `--windows-hide-console`,
            `--windows-icon=${iconFilename}`,
          ]
        : []),
      // todo .env
    ],
    { stdout: "inherit" },
  );
}
