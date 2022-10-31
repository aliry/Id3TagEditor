import { FileExtension } from '../constants';
import { IRowData } from '../types/types';

export default class TagService {
  public static async GetFileTags(
    folderPath: string,
    fileName: string
  ): Promise<IRowData> {
    const tags = await window.electron.id3.readTags(folderPath, fileName);
    return {
      fileNameOnDisk: fileName,
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
    folderPath: string,
    rowData: IRowData
  ): Promise<void> {
    const tags = {
      title: rowData.title,
      artist: rowData.artist,
      album: rowData.album,
      genre: rowData.genre,
    };
    const result = await window.electron.id3.updateTags(
      folderPath,
      rowData.fileNameOnDisk,
      tags
    );
    if (!result) {
      throw new Error('Failed to save tags');
    }
  }

  public static GenerateTags(rowData: IRowData[]): IRowData[] {
    const newRowData: IRowData[] = [];
    for (let idx = 0; idx < rowData.length; idx += 1) {
      const row = rowData[idx];
      const { title, artist, album } = TagService.ExtractTagsFromFileName(
        row.fileName
      );
      newRowData.push({
        fileNameOnDisk: row.fileNameOnDisk,
        fileName: row.fileName,
        title: row.title || title,
        artist: row.artist || artist,
        album: row.album || album,
        genre: row.genre || '',
      });
    }
    return newRowData;
  }

  public static GenerateFileNames(rowData: IRowData[]): IRowData[] {
    const newRowData: IRowData[] = [];
    for (let idx = 0; idx < rowData.length; idx += 1) {
      const row = rowData[idx];
      const fileName = `${row.title} - ${row.artist}`;
      newRowData.push({
        fileNameOnDisk: row.fileNameOnDisk,
        fileName,
        title: row.title,
        artist: row.artist,
        album: row.album,
        genre: row.genre,
      });
    }
    return newRowData;
  }
}
