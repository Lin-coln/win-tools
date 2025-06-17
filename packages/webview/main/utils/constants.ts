import path from "node:path";

// export const PORT = import.meta.env.PORT;
export const PORT = 3001;

export const APP_PACKAGED = !Boolean(import.meta.file.endsWith(".ts"));

export const APP_PATH = process.cwd();

export function getAppPath(...paths: string[]): string {
  return path.join(APP_PATH, ...paths).replace(/\\/g, "/");
}

export function getWorkerPath(str: string): string {
  const prefix = ".";
  const base = APP_PACKAGED ? "/" : "/main";
  return prefix + path.join(base, str).replace(/\\/g, "/");
}
