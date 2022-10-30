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
import GetErrorMessage from 'utils/utils';

const ActionsBar = () => {
  const folderSectorInputRef = useRef<HTMLInputElement>(null);
  const [currentFolder, setCurrentFolder] = useAtom(currentFolderAtom);
  const [rowData, setRowData] = useAtom(rowDataAtom);
  const [, setIsLoading] = useAtom(isLoadingAtom);
  const [, setMessage] = useAtom(messageAtom);
  const onGenerateTags = () => setRowData(TagService.GenerateTags(rowData));

  async function runFuncAsync<T>(
    func: (...a: any) => Promise<T>,
    ...args: unknown[]
  ): Promise<Awaited<T> | null> {
    let result = null;
    try {
      setIsLoading(true);
      result = await func(...args);
    } catch (error: unknown) {
      setMessage({ message: GetErrorMessage(error), type: 'error' });
    }

    setIsLoading(false);
    return result;
  }

  const onFolderSelect = async (folderPath: string) => {
    setCurrentFolder(folderPath);
    const data = await runFuncAsync(FileService.GetFilesInfo, folderPath);
    if (data) {
      setRowData(data);
    }
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
    const result = await runFuncAsync(
      TagService.SaveTags,
      rowData,
      currentFolder
    );
    if (!result) {
      setMessage({
        message: 'An error occurred while saving tags!',
        type: 'error',
      });
    } else {
      setMessage({
        message: 'Tags saved successfully!',
        type: 'success',
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
        <Button onClick={onGenerateTags}>Generate Tags from File Names</Button>
        <Button onClick={onSaveTags}>Save Tags</Button>
        <Button onClick={() => setRowData([])}>Clear All</Button>
      </ButtonGroup>
    </Paper>
  );
};

export default ActionsBar;
