import { app, BrowserWindow, nativeTheme } from "electron";
import createMainWindow from "./windows/createMainWindow.ts";

let mainWindow: BrowserWindow;

void main();

async function main() {
  app.on("window-all-closed", () => {
    if (process.platform === "darwin") return;
    app.quit();
  });
  nativeTheme.themeSource = "dark";
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
