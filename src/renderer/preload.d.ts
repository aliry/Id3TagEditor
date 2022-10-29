import * as id3 from 'node-id3';

declare global {
  interface Window {
    electron: {
      fs: {
        readdir(folderPath: string): Promise<string[]>;
      };
      id3: {
        readTags(filePath: string): Promise<id3.Tags>;
        updateTags(filePath: string, tags: id3.Tags): Promise<boolean>;
      };
    };
  }
}

export {};
