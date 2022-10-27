import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import * as id3 from 'node-id3';

export type Channels = 'ipc-example';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  fs: {
    readdir: async (folderPath: string) =>
      ipcRenderer.invoke('fs_readdir', folderPath),
  },
  id3: {
    readTags: async (filePath: string) =>
      ipcRenderer.invoke('id3_readTags', filePath),
    updateTags: async (filePath: string, tags: id3.Tags) =>
      ipcRenderer.invoke('id3_updateTags', filePath, tags),
  },
});
