import React, {
    useCallback,
    useMemo,
    useRef,
    useState,
  } from "react";
  import { AgGridReact } from "ag-grid-react";
  import './../../styles/style.css';
  import {
    ClientSideRowModelModule,
    ModuleRegistry,
    NumberFilterModule,
    PinnedRowModule,
    TextFilterModule,
    ValidationModule,
  } from "ag-grid-community";
  import {
    ColumnMenuModule,
    ColumnsToolPanelModule,
    ContextMenuModule,
    RowGroupingModule,
  } from "ag-grid-enterprise";

  ModuleRegistry.registerModules([
    TextFilterModule,
    PinnedRowModule,
    ClientSideRowModelModule,
    ColumnsToolPanelModule,
    ColumnMenuModule,
    ContextMenuModule,
    RowGroupingModule,
    NumberFilterModule,
    ValidationModule,
  ]);

  function createFeeRow(index) {
    return {
      regNo: `REG-${index}`,
      fullName: `Name-${index}`,
      totalFee: Math.floor(Math.random() * 100000),
      discount: Math.floor(Math.random() * 100),
      balanceFee: Math.floor(Math.random() * 1000),
      feePaid: Math.floor(Math.random() * 1000),
      feeDue: Math.floor(Math.random() * 1000),
      feeStatus: index % 2 === 0 ? "Paid" : "Pending",
      lastPaymentDate: new Date(),
    };
  }

  function getFeeData(count) {
    const rowData = [];
    for (let i = 0; i < count; i++) {
      rowData.push(createFeeRow(i));
    }
    return rowData;
  }

  const FeeTable = () => {
    const gridRef = useRef(null);
    const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
    const gridStyle = useMemo(() => ({ height: "500px", width: "100%" }), []);

    const [rowData, setRowData] = useState(getFeeData(5));
    const [columnDefs] = useState([
      { field: "regNo", headerName: "Registration No" },
      { field: "fullName", headerName: "Full Name" },
      { field: "totalFee", headerName: "Total Fee", filter: "agNumberColumnFilter" },
      { field: "discount", headerName: "Discount", filter: "agNumberColumnFilter" },
      { field: "balanceFee", headerName: "Balance Fee", filter: "agNumberColumnFilter" },
      { field: "feePaid", headerName: "Fee Paid", filter: "agNumberColumnFilter" },
      { field: "feeDue", headerName: "Fee Due", filter: "agNumberColumnFilter" },
      { field: "feeStatus", headerName: "Fee Status" },
      { field: "lastPaymentDate", headerName: "Last Payment Date", filter: "agDateColumnFilter" },
    ]);

    const defaultColDef = useMemo(() => ({
      enableRowGroup: false,
      enableValue: true,
      filter: true,
      sortable: true,
      resizable: true,
      floatingFilter: true,
    }), []);

    const popupParent = useMemo(() => document.body, []);

    const onGridReady = useCallback((params) => {
      document.querySelector("#currentRowCount").textContent = "5";
    }, []);

    const updateRowData = useCallback((rowCount) => {
      setRowData(getFeeData(rowCount));
      document.querySelector("#currentRowCount").textContent = `${rowCount}`;
    }, []);

    const onQuickFilterChanged = useCallback((e) => {
      gridRef.current.api.setQuickFilter(e.target.value);
    }, []);

    return (
      <div className="p-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Global Search..."
              onChange={onQuickFilterChanged}
              className="input input-bordered border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-4">
          <h2 className="text-xl font-bold mb-4 text-center">Fee Table</h2>
          <div id="myGrid" className="h-[500px] w-full">
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              domLayout="normal"
              popupParent={popupParent}
              onGridReady={onGridReady}
            />
          </div>
        </div>
      </div>
    );
  };

  export default FeeTable;
