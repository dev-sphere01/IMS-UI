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
import GoalService from "../../Services/GoalService";
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

const GoalTable = () => {
  const gridRef = useRef();
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({ goal: "" });
  const [formChanged, setFormChanged] = useState(false);

  // Fetch goals on component mount
  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await GoalService.getAllGoals();
      if (response.success && Array.isArray(response.data)) {
        setRowData(response.data);
      } else {
        setError("Failed to fetch goals");
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
      setError("An error occurred while fetching goals");
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async () => {
    try {
      if (!newGoal.goal.trim()) {
        alert("Goal cannot be empty");
        return;
      }

      await GoalService.createGoal(newGoal);
      setNewGoal({ goal: "" });
      setFormChanged(false);
      setShowAddModal(false);
      fetchGoals();
    } catch (error) {
      console.error("Error adding goal:", error);
      alert("Failed to add goal");
    }
  };

  const handleEditGoal = async () => {
    try {
      if (!currentGoal.goal.trim()) {
        alert("Goal cannot be empty");
        return;
      }

      await GoalService.updateGoal(currentGoal._id, currentGoal);
      setFormChanged(false);
      setShowEditModal(false);
      fetchGoals();
    } catch (error) {
      console.error("Error updating goal:", error);
      alert("Failed to update goal");
    }
  };

  const handleDeleteGoal = async (id) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        await GoalService.deleteGoal(id);
        fetchGoals();
      } catch (error) {
        console.error("Error deleting goal:", error);
        alert("Failed to delete goal");
      }
    }
  };

  // Column definitions
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Goal",
        field: "goal",
        filter: "agTextColumnFilter",
        sortable: true,
        flex: 1,
      },
      {
        headerName: "Created At",
        field: "createdAt",
        filter: "agDateColumnFilter",
        sortable: true,
        flex: 1,
        valueFormatter: (params) => {
          return params.value ? new Date(params.value).toLocaleString() : "";
        },
      },
      {
        headerName: "Updated At",
        field: "updatedAt",
        filter: "agDateColumnFilter",
        sortable: true,
        flex: 1,
        valueFormatter: (params) => {
          return params.value ? new Date(params.value).toLocaleString() : "";
        },
      },
      {
        headerName: "Actions",
        field: "actions",
        sortable: false,
        filter: false,
        width: 120,
        cellRenderer: (params) => (
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setCurrentGoal(params.data);
                setShowEditModal(true);
              }}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDeleteGoal(params.data._id)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Default column definitions
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  // Grid ready event
  const onGridReady = useCallback((params) => {
    params.api.sizeColumnsToFit();
  }, []);

  // Quick filter
  const onQuickFilterChanged = useCallback((e) => {
    gridRef.current.api.setQuickFilter(e.target.value);
  }, []);

  // Popup parent for grid
  const popupParent = useMemo(() => {
    return document.body;
  }, []);

  return (
    <div className="p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search..."
            onChange={onQuickFilterChanged}
            className="input input-bordered border-gray-300 rounded-lg px-4 py-2"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Add Goal
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-2xl p-4">
        <h2 className="text-xl font-bold mb-4 text-center">Course Goals Management</h2>
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

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Add Course Goal</h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Goal
              </label>
              <input
                type="text"
                value={newGoal.goal}
                onChange={(e) => {
                  setNewGoal({ ...newGoal, goal: e.target.value });
                  setFormChanged(true);
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="e.g., Career advancement"
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  if (formChanged && !window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
                    return;
                  }
                  setShowAddModal(false);
                  setNewGoal({ goal: "" });
                  setFormChanged(false);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGoal}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {showEditModal && currentGoal && (
        <div className="fixed inset-0 bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Edit Course Goal</h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Goal
              </label>
              <input
                type="text"
                value={currentGoal.goal}
                onChange={(e) => {
                  setCurrentGoal({
                    ...currentGoal,
                    goal: e.target.value,
                  });
                  setFormChanged(true);
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                autoFocus
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  if (formChanged && !window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
                    return;
                  }
                  setShowEditModal(false);
                  setFormChanged(false);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditGoal}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalTable;
