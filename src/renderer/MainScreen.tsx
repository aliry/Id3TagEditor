/* eslint-disable no-restricted-syntax */
import { LinearProgress, Stack } from '@mui/material';
import { isLoadingAtom } from 'state/atoms';
import { useAtom } from 'jotai';
import GridContainer from './components/GridContainer';
import MessageBar from './components/MessageBar';
import ActionsBar from './components/ActionsBar';

const MainContainer = () => {
  const [isLoading] = useAtom(isLoadingAtom);

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <div>
        <ActionsBar />
        {isLoading ? <LinearProgress /> : <div style={{ height: 4 }} />}
      </div>
      <GridContainer />
      <MessageBar />
    </Stack>
  );
};

export default MainContainer;
