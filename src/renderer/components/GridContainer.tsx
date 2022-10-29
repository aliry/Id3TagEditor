import { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-material.css'; // Optional theme CSS
import { useState } from 'react';
import { Paper } from '@mui/material';
import { IRowData } from '../../types/types';

export interface IGridContainerProps {
  rowData: IRowData[];
}

const GridContainer = (props: IGridContainerProps) => {
  const { rowData } = props;
  const [columnDefs] = useState<ColDef<IRowData>[]>([
    { field: 'fileName', flex: 2 },
    { field: 'title', editable: true, flex: 2 },
    { field: 'artist', editable: true, flex: 1 },
    { field: 'album', editable: true, flex: 1 },
    { field: 'genre', editable: true, flex: 0.5 },
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
