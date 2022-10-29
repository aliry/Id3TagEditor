import { contextBridge, ipcRenderer } from 'electron';
import * as id3 from 'node-id3';
import { IpcInvoke } from '../constants';

contextBridge.exposeInMainWorld('electron', {
  fs: {
    readdir: async (folderPath: string) =>
      ipcRenderer.invoke(IpcInvoke.fs.readdir, folderPath),
  },
  id3: {
    readTags: async (filePath: string) =>
      ipcRenderer.invoke(IpcInvoke.id3.readTags, filePath),
    updateTags: async (filePath: string, tags: id3.Tags): Promise<boolean> =>
      ipcRenderer.invoke(IpcInvoke.id3.updateTags, filePath, tags),
  },
});
