import { contextBridge, ipcRenderer } from 'electron';
import * as id3 from 'node-id3';
import { IpcInvoke } from '../constants';

contextBridge.exposeInMainWorld('electron', {
  fs: {
    readdir: async (folderPath: string) =>
      ipcRenderer.invoke(IpcInvoke.fs.readdir, folderPath),
    rename: async (
      folderPath: string,
      oldFileName: string,
      newFileName: string
    ) =>
      ipcRenderer.invoke(
        IpcInvoke.fs.rename,
        folderPath,
        oldFileName,
        newFileName
      ),
  },
  id3: {
    readTags: async (folderPath: string, fileName: string) =>
      ipcRenderer.invoke(IpcInvoke.id3.readTags, folderPath, fileName),
    updateTags: async (
      folderPath: string,
      fileName: string,
      tags: id3.Tags
    ): Promise<boolean> =>
      ipcRenderer.invoke(IpcInvoke.id3.updateTags, folderPath, fileName, tags),
  },
});
