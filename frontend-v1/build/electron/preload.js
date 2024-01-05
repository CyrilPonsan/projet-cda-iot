"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fsApi = {
    writeFile: function (chemin, data, options, callback) {
        electron_1.ipcRenderer.send("writeFile", { chemin: chemin, data: data, options: options });
        electron_1.ipcRenderer.once("writeFileResponse", function (event, error) {
            callback(error);
        });
    },
    // Add more required filesystem methods here
    readFile: function (chemin, options, callback) {
        electron_1.ipcRenderer.send("readFile", { chemin: chemin, options: options });
        electron_1.ipcRenderer.once("readFileResponse", function (event, error, data) {
            if (error) {
                // Handle the error case
                callback(error, null);
            }
            else {
                // Handle the success case
                callback(null, data);
            }
        });
    },
};
// Expose fsApi to the renderer process
electron_1.contextBridge.exposeInMainWorld("electron", {
    ipcRenderer: electron_1.ipcRenderer,
    fsApi: fsApi,
});
//# sourceMappingURL=preload.js.map