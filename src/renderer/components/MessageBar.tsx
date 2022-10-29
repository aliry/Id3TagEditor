import { Alert, Snackbar } from '@mui/material';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { messageAtom } from 'state/atoms';

const MessageBar = () => {
  const [message, setMessage] = useAtom(messageAtom);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (message) setOpen(true);
  }, [message]);

  const handleClose = () => {
    setOpen(false);
    setMessage(null);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={message?.type === 'error' ? null : 6000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={message?.type}
        sx={{ width: '100%' }}
      >
        {message?.message}
      </Alert>
    </Snackbar>
  );
};

export default MessageBar;
