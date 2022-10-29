import FileExtension from '../constants';
import TagService from './TagService';
import { IRowData } from '../types/types';

class FileService {
  public static async GetFilesInfo(folderPath: string): Promise<IRowData[]> {
    const files = await window.electron.fs.readdir(folderPath);

    const tagPromises: Promise<IRowData>[] = [];
    for (let i = 0; i < files.length; i += 1) {
      if (files[i].endsWith(FileExtension)) {
        tagPromises.push(TagService.GetFileTags(files[i], folderPath));
      }
    }

    const newRowData: IRowData[] = await Promise.all(tagPromises);
    return newRowData;
  }
}

export default FileService;
