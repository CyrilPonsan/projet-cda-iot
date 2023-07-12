import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

const fsApi = {
  writeFile: (
    chemin: string,
    data: any,
    options: any,
    callback: (err: NodeJS.ErrnoException | null) => void
  ) => {
    ipcRenderer.send("writeFile", { chemin, data, options });
    ipcRenderer.once(
      "writeFileResponse",
      (event: IpcRendererEvent, error: NodeJS.ErrnoException | null) => {
        callback(error);
      }
    );
  },
  // Add more required filesystem methods here
  readFile: (
    chemin: string,
    options: any,
    callback: (err: NodeJS.ErrnoException | null, data: any) => void
  ) => {
    ipcRenderer.send("readFile", { chemin, options });
    ipcRenderer.once(
      "readFileResponse",
      (
        event: IpcRendererEvent,
        error: NodeJS.ErrnoException | null,
        data: any
      ) => {
        if (error) {
          // Handle the error case
          callback(error, null);
        } else {
          // Handle the success case
          callback(null, data);
        }
      }
    );
  },
};

// Expose fsApi to the renderer process
contextBridge.exposeInMainWorld("electron", {
  ipcRenderer,
  fsApi,
});
