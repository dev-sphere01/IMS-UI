import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import "./../../styles/style.css";
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
import CourseService from "../../Services/CourseService";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

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

const CourseTable = () => {
  const gridRef = useRef(null);
  const navigate = useNavigate();

  // State for data and loading
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data when component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  // Function to fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await CourseService.getAllCourses();
      setRowData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("Failed to load courses. Please try again.");
      setLoading(false);
    }
  };

  // Function to handle edit action
  const handleEdit = (id) => {
    navigate(`/course/${id}`);
  };

  // Function to handle delete action
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await CourseService.deleteCourse(id);
        // Refresh the data
        fetchCourses();
      } catch (error) {
        console.error("Error deleting course:", error);
        setError("Failed to delete course. Please try again.");
      }
    }
  };

  // Action renderer component
  const ActionsRenderer = (props) => {
    return (
      <div className="flex space-x-2">
        <button
          onClick={() => handleEdit(props.data._id)}
          className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => handleDelete(props.data._id)}
          className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          <FaTrash />
        </button>
      </div>
    );
  };

  // Status renderer component
  const StatusRenderer = (props) => {
    return (
      <div
        className={`px-2 py-1 rounded text-xs font-medium ${props.value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
      >
        {props.value ? "Active" : "Inactive"}
      </div>
    );
  };

  // Fee renderer component
  const FeeRenderer = (props) => {
    return <span>₹{props.value.toLocaleString()}</span>;
  };

  // Column definitions
  const columnDefs = useMemo(() => [
    { field: "centerCode", headerName: "Center Code", filter: "agTextColumnFilter" },
    { field: "courseName", headerName: "Course Name", filter: "agTextColumnFilter" },
    {
      field: "fee",
      headerName: "Fee",
      filter: "agNumberColumnFilter",
      cellRenderer: FeeRenderer
    },
    { field: "duration", headerName: "Duration", filter: "agTextColumnFilter" },
    { field: "description", headerName: "Description", filter: "agTextColumnFilter" },
    {
      field: "isActive",
      headerName: "Status",
      filter: "agTextColumnFilter",
      cellRenderer: StatusRenderer
    },
    {
      headerName: "Actions",
      cellRenderer: ActionsRenderer,
      filter: false,
      sortable: false,
      width: 120,
    },
  ], []);

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
    // Any initialization code for the grid
  }, []);

  // Quick filter function
  const onQuickFilterChanged = useCallback((e) => {
    gridRef.current.api.setQuickFilter(e.target.value);
  }, []);

  // Add new course function
  const handleAddCourse = () => {
    navigate("/course");
  };

  return (
    <div className="p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search courses..."
            onChange={onQuickFilterChanged}
            className="input input-bordered border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
        <button
          onClick={handleAddCourse}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <FaPlus /> Add Course
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-2xl p-4">
        <h2 className="text-xl font-bold mb-4 text-center">Course Management</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div id="myGrid" className="h-[500px] w-full">
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              domLayout="normal"
              popupParent={popupParent}
              onGridReady={onGridReady}
              rowSelection="multiple"
              pagination={true}
              paginationPageSize={10}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseTable;