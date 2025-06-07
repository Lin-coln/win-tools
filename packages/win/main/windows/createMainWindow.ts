import { app, BrowserWindow } from "electron";
import { APP_ARGS, INDEX_FILENAME, PRELOAD_FILENAME } from "../utils/index.ts";

export default async function createMainWindow() {
  // create window
  const mainWindow: BrowserWindow = new BrowserWindow({
    webPreferences: {
      additionalArguments: [], // add process.argv to preload script
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: true,
      // webSecurity: !isDev,
      // devTools: isDev || isTest,
      spellcheck: false,
      preload: PRELOAD_FILENAME,
    },
    width: 1200,
    height: 900,
    minWidth: 320,
    minHeight: 480,

    // window style
    autoHideMenuBar: true,
    titleBarStyle: "hidden",
    titleBarOverlay: { color: "#262626", symbolColor: "#f5f5f5", height: 32 },
    transparent: false,
    // frame: false,
    // backgroundMaterial: "mica",
  } as Electron.BrowserWindowConstructorOptions);

  // add listeners
  app.on("before-quit", () => {
    if (mainWindow.isDestroyed()) return;
    mainWindow.destroy();
  });

  // load webContents
  if (APP_ARGS.INDEX_URL) {
    await mainWindow.loadURL(APP_ARGS.INDEX_URL as string);
  } else {
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
