import { Alert, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';

export interface IMessageBarProps {
  message: string;
}

const MessageBar = (props: IMessageBarProps) => {
  const { message } = props;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (message) setOpen(true);
  }, [message]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MessageBar;
