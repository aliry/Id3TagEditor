import { contextBridge, ipcRenderer } from 'electron';
import * as id3 from 'node-id3';

export type Channels = 'ipc-example';

contextBridge.exposeInMainWorld('electron', {
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
