"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var fs = require("fs");
var electron_devtools_installer_1 = require("electron-devtools-installer");
var tray = null;
function createWindow() {
    var win = new electron_1.BrowserWindow({
        width: 1024,
        height: 800,
        webPreferences: {
            // contextIsolation: false,
            preload: path.join(__dirname, "preload.js"),
        },
    });
    if (electron_1.app.isPackaged) {
        // 'build/index.html'
        win.loadURL("file://".concat(__dirname, "/../index.html"));
    }
    else {
        win.loadURL("http://localhost:3000/index.html");
        win.webContents.openDevTools();
        // Hot Reloading on 'node_modules/.bin/electronPath'
        require("electron-reload")(__dirname, {
            electron: path.join(__dirname, "..", "..", "node_modules", ".bin", "electron" + (process.platform === "win32" ? ".cmd" : "")),
            forceHardReset: true,
            hardResetMethod: "exit",
        });
        var trayIconPath = path.join(__dirname, "icons", "logo192.png");
        var trayIcon = electron_1.nativeImage.createFromPath(trayIconPath);
        tray = new electron_1.Tray(trayIcon);
        // Show/hide the main window when clicking the tray icon
        tray.on("click", function () {
            if (win.isVisible()) {
                win.hide();
            }
            else {
                win.show();
            }
        });
    }
}
electron_1.app.whenReady().then(function () {
    // DevTools
    (0, electron_devtools_installer_1.default)(electron_devtools_installer_1.REACT_DEVELOPER_TOOLS)
        .then(function (name) { return console.log("Added Extension:  ".concat(name)); })
        .catch(function (err) { return console.log("An error occurred: ", err); });
    createWindow();
    tray = new electron_1.Tray(path.join(__dirname, "plante.svg"));
    tray.setTitle("Alerte Arrosoir");
    electron_1.app.on("activate", function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
    electron_1.app.on("window-all-closed", function () {
        if (process.platform !== "darwin") {
            electron_1.app.quit();
        }
    });
});
electron_1.ipcMain.on("writeFile", function (event, _a) {
    var chemin = _a.chemin, data = _a.data, options = _a.options;
    var filePath = path.join(electron_1.app.getPath("userData"), chemin);
    fs.writeFile(filePath, data, options, function (error) {
        event.reply("writeFileResponse", error);
    });
});
electron_1.ipcMain.on("readFile", function (event, _a) {
    var chemin = _a.chemin, options = _a.options;
    var filePath = path.join(electron_1.app.getPath("userData"), chemin);
    fs.readFile(filePath, options, function (error, data) {
        if (error) {
            event.reply("readFileResponse", error.message, data);
        }
        else {
            event.reply("readFileResponse", null, data);
        }
    });
});
//# sourceMappingURL=main.js.map