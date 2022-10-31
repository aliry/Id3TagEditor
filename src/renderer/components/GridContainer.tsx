import { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-enterprise'; // Can be used to enable enterprise features like fill handle and copy/paste. Need enterprise license.
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-material.css'; // Optional theme CSS
import { useState } from 'react';
import { Paper } from '@mui/material';
import { useAtom } from 'jotai';
import { rowDataAtom } from 'state/atoms';
import { IRowData } from '../../types/types';

const GridContainer = () => {
  const [rowData] = useAtom(rowDataAtom);
  const [columnDefs] = useState<ColDef<IRowData>[]>([
    { field: 'fileName', editable: true, width: 200, flex: 2 },
    { field: 'title', editable: true, width: 100, flex: 1 },
    { field: 'artist', editable: true, width: 100, flex: 1 },
    { field: 'album', editable: true, width: 100, flex: 1 },
    { field: 'genre', editable: true, width: 75, flex: 0.5 },
  ]);

  return (
    <Paper
      className="ag-theme-material"
      style={{ height: 'calc(100vh - 100px)' }}
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
  );
};

export default GridContainer;
