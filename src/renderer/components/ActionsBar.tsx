import { Button, ButtonGroup, Paper } from '@mui/material';
import { useAtom } from 'jotai';
import { useRef } from 'react';
import FileService from 'services/FileService';
import TagService from 'services/TagService';
import {
  currentFolderAtom,
  errorMessageAtom,
  isLoadingAtom,
  rowDataAtom,
} from 'state/atoms';
import GetErrorMessage from 'utils/utils';

const ActionsBar = () => {
  const folderSectorInputRef = useRef<HTMLInputElement>(null);
  const [currentFolder, setCurrentFolder] = useAtom(currentFolderAtom);
  const [rowData, setRowData] = useAtom(rowDataAtom);
  const [, setIsLoading] = useAtom(isLoadingAtom);
  const [, setErrorMessage] = useAtom(errorMessageAtom);
  const onGenerateTags = () => TagService.GenerateTags(rowData);

  async function runFuncAsync<T>(
    func: (...a: any) => Promise<T>,
    ...args: unknown[]
  ): Promise<Awaited<T> | null> {
    let result = null;
    try {
      setIsLoading(true);
      result = await func(...args);
    } catch (error: unknown) {
      setErrorMessage(GetErrorMessage(error));
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

  const onSaveTags = async () =>
    runFuncAsync(TagService.SaveTags, rowData, currentFolder);

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
        <Button onClick={() => setRowData([])}>Reset</Button>
      </ButtonGroup>
    </Paper>
  );
};

export default ActionsBar;
