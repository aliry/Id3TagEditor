import * as fs from 'fs';
import * as path from 'path';
import * as id3 from 'node-id3';
import { ipcMain } from 'electron';
import { IpcInvoke } from '../constants';

ipcMain.handle(IpcInvoke.fs.readdir, async (event, folderPath: string) => {
  return fs.promises.readdir(folderPath);
});

ipcMain.handle(
  IpcInvoke.fs.rename,
  async (
    event,
    folderPath: string,
    oldFileName: string,
    newFileName: string
  ): Promise<boolean> => {
    const oldFilePath = path.join(folderPath, oldFileName);
    const newFilePath = path.join(folderPath, newFileName);
    if (!fs.existsSync(newFilePath) && fs.existsSync(oldFilePath)) {
      fs.promises.rename(oldFilePath, newFilePath);
      return true;
    }
    return false;
  }
);

ipcMain.handle(
  IpcInvoke.id3.readTags,
  async (event, folderPath: string, fileName: string): Promise<id3.Tags> => {
    const filePath = path.join(folderPath, fileName);
    if (fs.existsSync(filePath)) {
      return id3.Promise.read(filePath);
    }
    return {};
  }
);

ipcMain.handle(
  IpcInvoke.id3.updateTags,
  async (
    event,
    folderPath: string,
    fileName: string,
    tags: id3.Tags
  ): Promise<boolean> => {
    const filePath = path.join(folderPath, fileName);
    if (fs.existsSync(filePath)) {
      await id3.Promise.update(tags, filePath);
      return true;
    }
    return false;
  }
);
