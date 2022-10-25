import { useState, useRef, ChangeEvent } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
import { Paper } from '@mui/material';

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
  const [rowData, setRowData] = useState<IRowData[]>([]);

  // Each Column Definition results in one Column.
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

  const onFolderSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const aFile = e.target.files[0];
    currentFolder.current = aFile.path.replace(aFile.name, '');
    let files = await window.electron.fs.readdir(currentFolder.current);
    files = files.filter((f) => f.endsWith(FileExtension));
    const newRowData: IRowData[] = [];
    for (let i = 0; i < files.length; i += 1) {
      const fileName = files[i].replace(FileExtension, '');
      const { title, artist, album } = extractTagsFromFileName(fileName);
      newRowData.push({
        fileName,
        title,
        artist,
        album,
        genre: '',
      });
    }

    setRowData(newRowData);
  };

  return (
    <div style={{}}>
      <Paper style={{ padding: 10 }}>
        <input webkitdirectory="" type="file" onChange={onFolderSelect} />
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
          enableRangeHandle
          enableRangeSelection
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
          }}
        />
      </Paper>
    </div>
  );
};

export default MainContainer;
