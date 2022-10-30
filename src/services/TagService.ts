import { FileExtension } from '../constants';
import { IRowData } from '../types/types';

export default class TagService {
  public static async GetFileTags(
    fileName: string,
    folderPath: string
  ): Promise<IRowData> {
    const filePath = `${folderPath}${fileName}`;
    const tags = await window.electron.id3.readTags(filePath);
    return {
      fileName: fileName.replace(FileExtension, ''),
      title: tags.title ?? '',
      artist: tags.artist ?? '',
      album: tags.album ?? '',
      genre: tags.genre ?? '',
    };
  }

  public static ExtractTagsFromFileName(fileName: string) {
    const sections = fileName.split('-');
    const artist = sections.length > 0 ? sections[0].trim() : '';
    const title = sections.length > 1 ? sections[1].trim() : '';
    const album = sections.length > 2 ? sections[2].trim() : '';
    return { title, artist, album };
  }

  public static async SaveTags(
    rowData: IRowData[],
    folderPath: string
  ): Promise<boolean> {
    const promises: Promise<boolean>[] = [];
    for (let idx = 0; idx < rowData.length; idx += 1) {
      const row = rowData[idx];
      const filePath = `${folderPath}${row.fileName}${FileExtension}`;
      const tags = {
        title: row.title,
        artist: row.artist,
        album: row.album,
        genre: row.genre,
      };

      promises.push(window.electron.id3.updateTags(filePath, tags));
    }
    const results = await Promise.all(promises);
    return results.every((result) => result);
  }

  public static GenerateTags(rowData: IRowData[]): IRowData[] {
    const newRowData: IRowData[] = [];
    for (let idx = 0; idx < rowData.length; idx += 1) {
      const row = rowData[idx];
      const { title, artist, album } = TagService.ExtractTagsFromFileName(
        row.fileName
      );
      newRowData.push({
        fileName: row.fileName,
        title: row.title || title,
        artist: row.artist || artist,
        album: row.album || album,
        genre: row.genre || '',
      });
    }
    return newRowData;
  }
}
