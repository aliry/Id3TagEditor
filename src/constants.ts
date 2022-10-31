export const FileExtension = '.mp3';

export const IpcChannels = {
  errorMsg: 'ipc-error',
};

export const IpcInvoke = {
  fs: {
    readdir: 'fs_readdir',
    rename: 'fs_rename',
  },
  id3: {
    readTags: 'id3_readTags',
    updateTags: 'id3_updateTags',
  },
};
