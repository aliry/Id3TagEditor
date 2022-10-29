import * as fs from 'fs';
import * as id3 from 'node-id3';
import { ipcMain } from 'electron';
import { IpcInvoke } from '../constants';

ipcMain.handle(IpcInvoke.fs.readdir, async (event, folderPath: string) => {
  return fs.promises.readdir(folderPath);
});

ipcMain.handle(
  IpcInvoke.id3.readTags,
  async (event, filePath: string): Promise<id3.Tags> => {
    if (fs.existsSync(filePath)) {
      return id3.Promise.read(filePath);
    }
    return {};
  }
);

ipcMain.handle(
  IpcInvoke.id3.updateTags,
  async (event, filePath: string, tags: id3.Tags): Promise<boolean> => {
    if (fs.existsSync(filePath)) {
      await id3.Promise.update(tags, filePath);
      return true;
    }
    return false;
  }
);
