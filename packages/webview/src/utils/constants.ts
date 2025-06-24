import path from "node:path";

const BUN_ROOT: string =
  process.platform === "win32" ? "B:/~BUN/root/" : "B:/~BUN/root/";

export const isPackaged = Boolean(Bun.embeddedFiles.length);

export function getPackagedPath(...paths: string[]): string {
  if (!isPackaged) throw new Error("Unable to find packaged path");
  return path.join(BUN_ROOT, ...paths);
}

// function getAppPath(...paths: string[]): string {
//   const APP_PATH = process.cwd();
//   return path.join(APP_PATH, ...paths).replace(/\\/g, "/");
// }

export function getWorkerUrl(...paths: string[]): string {
  const prefix = ".";
  const base = isPackaged ? "/workers" : "/src/workers";
  return prefix + path.join(base, ...paths).replace(/\\/g, "/");
}
