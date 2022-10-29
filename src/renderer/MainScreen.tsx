/* eslint-disable no-restricted-syntax */
import { LinearProgress, Stack } from '@mui/material';
import { isLoadingAtom, rowDataAtom } from 'state/atoms';
import { useAtom } from 'jotai';
import GridContainer from './components/GridContainer';
import MessageBar from './components/MessageBar';
import ActionsBar from './components/ActionsBar';

const MainContainer = () => {
  const [isLoading] = useAtom(isLoadingAtom);
  const [rowData] = useAtom(rowDataAtom);

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <div>
        <ActionsBar />
        {isLoading ? <LinearProgress /> : <div style={{ height: 4 }} />}
      </div>
      <GridContainer rowData={rowData} />
      <MessageBar />
    </Stack>
  );
};

export default MainContainer;
