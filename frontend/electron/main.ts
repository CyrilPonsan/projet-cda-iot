import { app, BrowserWindow, Tray, ipcMain, nativeImage } from "electron";
import * as path from "path";
import * as fs from "fs";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";

let tray = null;

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 800,
    webPreferences: {
      // contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (app.isPackaged) {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  } else {
    win.loadURL("http://localhost:3000/index.html");

    win.webContents.openDevTools();

    // Hot Reloading on 'node_modules/.bin/electronPath'
    require("electron-reload")(__dirname, {
      electron: path.join(
        __dirname,
        "..",
        "..",
        "node_modules",
        ".bin",
        "electron" + (process.platform === "win32" ? ".cmd" : "")
      ),
      forceHardReset: true,
      hardResetMethod: "exit",
    });

    const trayIconPath = path.join(__dirname, "icons", "logo192.png");
    const trayIcon = nativeImage.createFromPath(trayIconPath);

    tray = new Tray(trayIcon);

    // Show/hide the main window when clicking the tray icon
    tray.on("click", () => {
      if (win.isVisible()) {
        win.hide();
      } else {
        win.show();
      }
    });
  }
}

app.whenReady().then(() => {
  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err));

  createWindow();

  tray = new Tray(path.join(__dirname, "plante.svg"));
  tray.setTitle("Alerte Arrosoir");

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
});

ipcMain.on("writeFile", (event, { chemin, data, options }) => {
  const filePath = path.join(app.getPath("userData"), chemin);
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
