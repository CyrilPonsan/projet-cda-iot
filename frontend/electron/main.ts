import { app, BrowserWindow, ipcMain, Tray } from "electron";
import * as path from "path";
import * as fs from "fs";

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, "../dist");
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

let tray: Tray | null = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 800,
    icon: path.join(process.env.PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }
  tray = new Tray(path.join(process.env.PUBLIC, "plante.png"));

  // You can add more functionality to the tray icon, like showing a tooltip or handling clicks
  tray.setToolTip("Alerte Arrosoir est en cours d'exécution");
  tray.on("click", () => {
    // Perform some action when the tray icon is clicked
    if (tray) {
      tray.on("click", () => {
        win?.isVisible() ? win.hide() : win?.show();
      });
    }
  });

  /*   const contextMenu = Menu.buildFromTemplate([
    { label: "Item1", type: "radio" },
    { label: "Item2", type: "radio" },
    { label: "Item3", type: "radio", checked: true },
    { label: "Item4", type: "radio" },
  ]);

  tray.setContextMenu(contextMenu); */
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

ipcMain.on("writeFile", (event, { chemin, data, options }) => {
  const filePath = path.join(app.getPath("userData"), chemin);
  console.log(filePath);

  fs.writeFile(filePath, data, options, (error) => {
    event.reply("writeFileResponse", error);
  });
});

ipcMain.on("readFile", (event, { chemin, options }) => {
  const filePath = path.join(app.getPath("userData"), chemin);
  fs.readFile(filePath, options, (error, data) => {
    if (error) {
      event.reply("readFileResponse", error.message, data);
    } else {
      event.reply("readFileResponse", null, data);
    }
  });
});
