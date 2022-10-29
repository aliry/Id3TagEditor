import { Alert, Snackbar } from '@mui/material';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { errorMessageAtom } from 'state/atoms';

const MessageBar = () => {
  const [errorMessage] = useAtom(errorMessageAtom);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (errorMessage) setOpen(true);
  }, [errorMessage]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        {errorMessage}
      </Alert>
    </Snackbar>
  );
};

export default MessageBar;
