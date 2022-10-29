/* eslint-disable no-restricted-syntax */
import { useState, useRef } from 'react';
import { LinearProgress, Stack } from '@mui/material';
import GetErrorMessage from 'utils/utils';
import { IRowData } from '../types/types';
import GridContainer from './components/GridContainer';
import MessageBar from './components/MessageBar';
import TopBar from './components/TopBar';
import FileService from '../services/FileService';
import TagService from '../services/TagService';

const MainContainer = () => {
  const currentFolder = useRef('');
  const [rowData, setRowData] = useState<IRowData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const showErrorBar = (message: string) => setErrorMessage(message);
  const onGenerateTags = () => TagService.GenerateTags(rowData);

  async function runFuncAsync<T>(
    func: (...a: any) => Promise<T>,
    ...args: unknown[]
  ): Promise<Awaited<T> | null> {
    let result = null;
    try {
      setIsProcessing(true);
      result = await func(...args);
    } catch (error: unknown) {
      showErrorBar(GetErrorMessage(error));
    }

    setIsProcessing(false);
    return result;
  }

  const onFolderSelect = async (folderPath: string) => {
    currentFolder.current = folderPath;
    const data = await runFuncAsync(FileService.GetFilesInfo, folderPath);
    if (data) {
      setRowData(data);
    }
  };

  const onSaveTags = async () =>
    runFuncAsync(TagService.SaveTags, rowData, currentFolder.current);

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <div>
        <TopBar
          onFolderSelect={onFolderSelect}
          onSaveTags={onSaveTags}
          onGenerateTags={onGenerateTags}
          onReset={() => setRowData([])}
        />
        {isProcessing ? <LinearProgress /> : <div style={{ height: 4 }} />}
      </div>
      <GridContainer rowData={rowData} />
      <MessageBar message={errorMessage} />
    </Stack>
  );
};

export default MainContainer;
