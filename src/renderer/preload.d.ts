import * as id3 from 'node-id3';

declare global {
  interface Window {
    electron: {
      fs: {
        readdir(folderPath: string): Promise<string[]>;
        rename(
          folderPath: string,
          oldFileName: string,
          newFileName: string
        ): Promise<boolean>;
      };
      id3: {
        readTags(folderPath: string, fileName: string): Promise<id3.Tags>;
        updateTags(
          folderPath: string,
          fileName: string,
          tags: id3.Tags
        ): Promise<boolean>;
      };
    };
  }
}

export {};
