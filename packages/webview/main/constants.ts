import * as path from "node:path";

// export const PORT = Bun.env.PORT;
export const PORT = 3001;

export const APP_PACKAGED = !Boolean(import.meta.file.endsWith(".ts"));

export const APP_PATH = process.cwd();
