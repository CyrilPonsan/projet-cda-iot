import { ipcRenderer } from "electron";

declare global {
  interface Window {
    electron: {
      fsApi: {
        writeFile: (
          path: string,
          data: any,
          options: any,
          callback: (err: NodeJS.ErrnoException | null) => void
        ) => void;
        readFile: (
          path: string,
          options: any,
          callback: (err: NodeJS.ErrnoException | null, data: any) => void
        ) => void;
      };
      ipcRenderer: typeof ipcRenderer;
    };
  }
}
