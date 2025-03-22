import { app, BrowserWindow, nativeTheme } from "electron";
import path from "path";
import * as url from "node:url";

let mainWindow: BrowserWindow;

void main();

async function main() {
  app.on("window-all-closed", () => {
    if (process.platform === "darwin") return;
    app.quit();
  });
  nativeTheme.themeSource = "system";
  await app.whenReady();
  mainWindow = await initWindows();
}

async function initWindows() {
  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length !== 0) return;
    await createWindows();
  });
  await createWindows();

  return mainWindow;

  async function createWindows() {
    mainWindow = await createMainWindow();
  }
}

async function createMainWindow() {
  // create window
  const mainWindow: BrowserWindow = new BrowserWindow({
    autoHideMenuBar: true,
    webPreferences: {
      additionalArguments: [], // add process.argv to preload script
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: true,
      // webSecurity: !isDev,
      // devTools: isDev || isTest,
      spellcheck: false,
    },
    width: 1200,
    height: 900,

    transparent: false,
    frame: false,
    backgroundMaterial: "mica",
  } as Electron.BrowserWindowConstructorOptions);

  // add listeners
  app.on("before-quit", () => {
    if (mainWindow.isDestroyed()) return;
    mainWindow.destroy();
  });

  // load webContents
  const APP_ARGS: Record<string, string | number | boolean> =
    Object.fromEntries(
      process.argv
        .slice(2)
        .filter((x) => x.startsWith("--"))
        .map((x) => {
          const [k, v] = x.split("=");
          return [k.slice(2), JSON.parse(v)];
        }),
    );
  console.log({ APP_ARGS });
  if (APP_ARGS.INDEX_URL) {
    await mainWindow.loadURL(APP_ARGS.INDEX_URL as string);
  } else {
    const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
    const INDEX_FILENAME = path.resolve(
      __dirname,
      "../dist-renderer/index.html",
    );
    await mainWindow.loadFile(INDEX_FILENAME);
  }

  // show
  await new Promise<void>((resolve) => {
    mainWindow.once("show", () => resolve());
    // mainWindow.showInactive();
    mainWindow.show();
  });

  // show devTools
  // mainWindow.webContents.openDevTools({ mode: "detach" });
  return mainWindow;
}
