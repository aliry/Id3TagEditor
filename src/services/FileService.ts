import { FileExtension } from '../constants';
import TagService from './TagService';
import { IRowData } from '../types/types';

class FileService {
  public static async GetFilesInfo(folderPath: string): Promise<IRowData[]> {
    const files = await window.electron.fs.readdir(folderPath);

    const tagPromises: Promise<IRowData>[] = [];
    for (let i = 0; i < files.length; i += 1) {
      if (files[i].endsWith(FileExtension)) {
        tagPromises.push(TagService.GetFileTags(folderPath, files[i]));
      }
    }

    const newRowData: IRowData[] = await Promise.all(tagPromises);
    return newRowData;
  }

  public static async RenameFile(
    folderPath: string,
    oldFileName: string,
    newFileName: string
  ): Promise<void> {
    const result = await window.electron.fs.rename(
      folderPath,
      oldFileName,
      newFileName
    );
    if (!result) {
      throw new Error('Failed to rename file');
    }
  }
}

export default FileService;
