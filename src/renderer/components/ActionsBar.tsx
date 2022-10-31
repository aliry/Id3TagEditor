import { Button, ButtonGroup, Paper } from '@mui/material';
import { useAtom } from 'jotai';
import { useRef } from 'react';
import FileService from 'services/FileService';
import TagService from 'services/TagService';
import {
  currentFolderAtom,
  messageAtom,
  isLoadingAtom,
  rowDataAtom,
} from 'state/atoms';
import { IRowData } from 'types/types';
import GetErrorMessage from 'utils/utils';
import { FileExtension } from '../../constants';

const ActionsBar = () => {
  const folderSectorInputRef = useRef<HTMLInputElement>(null);
  const [currentFolder, setCurrentFolder] = useAtom(currentFolderAtom);
  const [rowData, setRowData] = useAtom(rowDataAtom);
  const [, setIsLoading] = useAtom(isLoadingAtom);
  const [, setMessage] = useAtom(messageAtom);
  const onGenerateTags = () => setRowData(TagService.GenerateTags(rowData));
  const onGenerateFileNames = () =>
    setRowData(TagService.GenerateFileNames(rowData));

  const onFolderSelect = async (folderPath: string) => {
    setIsLoading(true);
    setCurrentFolder(folderPath);
    try {
      const data = await FileService.GetFilesInfo(folderPath);
      if (data) {
        setRowData(data);
      }
    } catch (error: unknown) {
      setMessage({ message: GetErrorMessage(error), type: 'error' });
    }
    setIsLoading(false);
  };

  const onInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const aFile = e.target.files[0];
      const folderPath = aFile.path.replace(aFile.name, '');
      onFolderSelect(folderPath);
    }
    e.target.value = '';
  };

  const onSaveTags = async () => {
    const renameFileNamesWithError = [];
    const tagUpdateFileNamesWithError = [];
    const newRowData: IRowData[] = [];

    setIsLoading(true);
    await Promise.all(
      rowData.map(async (row) => {
        const newRow = { ...row };
        const newFileName = `${row.fileName}${FileExtension}`;
        if (row.fileNameOnDisk !== newFileName) {
          try {
            await FileService.RenameFile(
              currentFolder,
              row.fileNameOnDisk,
              newFileName
            );
            newRow.fileNameOnDisk = newFileName;
          } catch (error: unknown) {
            renameFileNamesWithError.push(row.fileNameOnDisk);
          }
        }
        try {
          await TagService.SaveTags(currentFolder, newRow);
        } catch (error: unknown) {
          tagUpdateFileNamesWithError.push(newRow.fileNameOnDisk);
        }

        newRowData.push(newRow);
      })
    );

    setRowData(newRowData);
    setIsLoading(false);

    if (
      renameFileNamesWithError.length === 0 &&
      tagUpdateFileNamesWithError.length === 0
    ) {
      setMessage({
        message: 'All files saved successfully!',
        type: 'success',
      });
    } else {
      setMessage({
        message: 'An error occurred while saving!',
        type: 'error',
      });
    }
  };

  return (
    <Paper style={{ padding: 10 }}>
      <input
        webkitdirectory=""
        type="file"
        onChange={onInputChangeHandler}
        ref={folderSectorInputRef}
        style={{ display: 'none' }}
      />
      <ButtonGroup variant="text">
        <Button onClick={() => folderSectorInputRef.current?.click()}>
          Load Files
        </Button>
        <Button onClick={onGenerateTags}>Auto Generate Tags</Button>
        <Button onClick={onGenerateFileNames}>Auto Generate Filenames</Button>
        <Button onClick={onSaveTags}>Save All</Button>
        <Button onClick={() => setRowData([])}>Clear All</Button>
      </ButtonGroup>
    </Paper>
  );
};

export default ActionsBar;
