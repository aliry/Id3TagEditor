import { Button, ButtonGroup, Paper } from '@mui/material';
import { useRef } from 'react';

export interface IToolbarProps {
  onFolderSelect: (folderPath: string) => void;
  onGenerateTags: () => void;
  onSaveTags: () => void;
  onReset: () => void;
}

const TopBar = (props: IToolbarProps) => {
  const folderSectorInputRef = useRef<HTMLInputElement>(null);
  const { onFolderSelect, onGenerateTags, onSaveTags, onReset } = props;

  const onInputChangeHanlder = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const aFile = e.target.files[0];
      const folderPath = aFile.path.replace(aFile.name, '');
      onFolderSelect(folderPath);
    }
    e.target.value = '';
  };

  return (
    <Paper style={{ padding: 10 }}>
      <input
        webkitdirectory=""
        type="file"
        onChange={onInputChangeHanlder}
        ref={folderSectorInputRef}
        style={{ display: 'none' }}
      />
      <ButtonGroup variant="text">
        <Button onClick={() => folderSectorInputRef.current?.click()}>
          Load Files
        </Button>
        <Button onClick={onGenerateTags}>Generate Tags from File Names</Button>
        <Button onClick={onSaveTags}>Save Tags</Button>
        <Button onClick={onReset}>Reset</Button>
      </ButtonGroup>
    </Paper>
  );
};

export default TopBar;
