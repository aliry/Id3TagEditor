/* eslint-disable no-restricted-syntax */
import { useState, useRef, ChangeEvent } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { Paper, Button, ButtonGroup } from '@mui/material';

const FileExtension = '.mp3';

interface IRowData {
  fileName: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
}

const MainContainer = () => {
  const currentFolder = useRef('');
  const folderSectorInputRef = useRef<HTMLInputElement>(null);
  const [rowData, setRowData] = useState<IRowData[]>([]);

  const [columnDefs] = useState<ColDef<IRowData>[]>([
    { field: 'fileName', flex: 2 },
    { field: 'title', editable: true, flex: 2 },
    { field: 'artist', editable: true, flex: 1 },
    { field: 'album', editable: true, flex: 1 },
    { field: 'genre', editable: true, flex: 0.5 },
  ]);

  const extractTagsFromFileName = (fileName: string) => {
    const sections = fileName.split('-');
    const artist = sections.length > 0 ? sections[0].trim() : '';
    const title = sections.length > 1 ? sections[1].trim() : '';
    const album = sections.length > 2 ? sections[2].trim() : '';
    return { title, artist, album };
  };

  const getFileTags = async (fileName: string): Promise<IRowData> => {
    const filePath = `${currentFolder.current}${fileName}`;
    const tags = await window.electron.id3.readTags(filePath);
    return {
      fileName,
      title: tags.title ?? '',
      artist: tags.artist ?? '',
      album: tags.album ?? '',
      genre: tags.genre ?? '',
    };
  };

  const onFolderSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const aFile = e.target.files[0];
    currentFolder.current = aFile.path.replace(aFile.name, '');
    const files = await window.electron.fs.readdir(currentFolder.current);

    const tagPromises: Promise<IRowData>[] = [];
    for (let i = 0; i < files.length; i += 1) {
      if (files[i].endsWith(FileExtension)) {
        tagPromises.push(getFileTags(files[i]));
      }
    }

    const newRowData: IRowData[] = await Promise.all(tagPromises);
    setRowData(newRowData);
    e.target.value = '';
  };

  const onGenerateTags = () => {
    const newRowData: IRowData[] = [];
    for (const row of rowData) {
      const { title, artist, album } = extractTagsFromFileName(row.fileName);
      newRowData.push({
        fileName: row.fileName,
        title,
        artist,
        album,
        genre: '',
      });
    }
  };

  return (
    <div style={{}}>
      <Paper style={{ padding: 10 }}>
        <input
          webkitdirectory=""
          type="file"
          onChange={onFolderSelect}
          ref={folderSectorInputRef}
          style={{ display: 'none' }}
        />
        <ButtonGroup variant="text">
          <Button onClick={() => folderSectorInputRef.current?.click()}>
            Load Files
          </Button>
          <Button onClick={() => onGenerateTags}>
            Generate Tags from File Names
          </Button>
          <Button>Save Tags</Button>
          <Button onClick={() => setRowData([])}>Reset</Button>
        </ButtonGroup>
      </Paper>
      <Paper
        className="ag-theme-alpine"
        style={{ height: 'calc(100vh - 100px)', marginTop: 20 }}
      >
        <AgGridReact<IRowData>
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            resizable: true,
          }}
          enableRangeSelection
          enableFillHandle
          undoRedoCellEditing
          undoRedoCellEditingLimit={20}
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
          }}
        />
      </Paper>
    </div>
  );
};

export default MainContainer;
