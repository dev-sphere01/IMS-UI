import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect
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
  CsvExportModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
import EnquiryService from "../../Services/EnquiryService";
import { FaSync, FaFileExcel, FaFileCsv, FaFilter, FaSearch } from "react-icons/fa";

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
  CsvExportModule,
  ExcelExportModule,
]);

// Format date for display
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

const EnquiryGrid = () => {
  const gridRef = useRef(null);

  // State for data and loading
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data when component mounts
  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Function to fetch enquiries from the API
  const fetchEnquiries = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      console.log('Fetching enquiries...');
      const response = await EnquiryService.getAllEnquiries();
      console.log('Enquiries fetched:', response);

      if (response && response.success) {
        const data = response.data || [];
        console.log(`Received ${data.length} enquiries`);

        // Process the data to ensure all fields are properly formatted
        const processedData = data.map(item => {
          // Ensure boolean fields are properly formatted
          const processedItem = {
            ...item,
            exServicemen: item.exServicemen === true || item.exServicemen === 'true' || item.exServicemen === 'yes' ? 'Yes' : 'No',
            speciallyAbled: item.speciallyAbled === true || item.speciallyAbled === 'true' || item.speciallyAbled === 'yes' ? 'Yes' : 'No',
            computerAccess: item.computerAccess === true || item.computerAccess === 'true' || item.computerAccess === 'yes' ? 'Yes' : 'No',
          };

          // Add details for special fields if they exist
          if (item.speciallyAbledDetails) {
            processedItem.speciallyAbled = `Yes - ${item.speciallyAbledDetails}`;
          } else if (item.speciallyAbledOther) {
            processedItem.speciallyAbled = `Yes - ${item.speciallyAbledOther}`;
          }

          if (item.computerAccessDetails) {
            processedItem.computerAccess = `Yes - ${item.computerAccessDetails}`;
          } else if (item.computerAccessOther) {
            processedItem.computerAccess = `Yes - ${item.computerAccessOther}`;
          }

          // Ensure otherInfo is properly displayed
          if (item.otherInfo) {
            processedItem.otherInfo = item.otherInfo;
            console.log(`Enquiry has otherInfo: ${item.otherInfo}`);
          }

          return processedItem;
        });

        // Log the first few items for debugging
        processedData.slice(0, 3).forEach((item, index) => {
          console.log(`Enquiry ${index} - Full Data:`, item);
          console.log(`Enquiry ${index} - otherInfo:`, item.otherInfo);
          console.log(`Enquiry ${index} - exServicemen:`, item.exServicemen);
          console.log(`Enquiry ${index} - speciallyAbled:`, item.speciallyAbled);
          console.log(`Enquiry ${index} - computerAccess:`, item.computerAccess);
          console.log(`Enquiry ${index} - interestCourse:`, item.interestCourse);
          console.log(`Enquiry ${index} - referralSource:`, item.referralSource);
          console.log(`Enquiry ${index} - goalsForCourse:`, item.goalsForCourse);
          console.log(`Enquiry ${index} - preferredBatchTime:`, item.preferredBatchTime);
        });

        setRowData(processedData);
      } else {
        console.error('API response indicates failure or invalid format:', response);
        setError('Failed to fetch enquiries. The server response was invalid.');
      }
    } catch (err) {
      console.error('Error fetching enquiries:', err);
      // Provide more detailed error information
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', err.response.data);
        console.error('Error response status:', err.response.status);
        setError(`Server error (${err.response.status}): ${err.response.data?.message || 'Unknown error'}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setError('No response received from server. Please check your network connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', err.message);
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format Yes/No values consistently
  const formatYesNo = (value, details = null) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    } else if (value === 'yes' || value === true || value === 'true') {
      return 'Yes';
    } else if (value === 'no' || value === false || value === 'false') {
      return 'No';
    } else if (value === 'other' && details) {
      return `Yes - ${details}`;
    } else if (value === 'other') {
      return 'Yes - Other';
    } else {
      return value || 'No';
    }
  };

  const [columnDefs] = useState([
    // Registration Information (matching form order)
    { field: "centerCode", headerName: "Center Code", width: 120 },
    { field: "employeeID", headerName: "Employee ID", width: 120 },
    {
      field: "otherInfo",
      headerName: "Other Info",
      width: 200,
      cellRenderer: (params) => {
        if (params.value) {
          // Replace newlines with <br> for proper display
          return params.value.replace(/\n/g, '<br>');
        }
        return '';
      }
    },

    // Personal Information
    { field: "fullName", headerName: "Full Name", width: 180 },
    {
      field: "dateOfBirth",
      headerName: "Date of Birth",
      width: 120,
      valueFormatter: (params) => formatDate(params.value)
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      valueFormatter: (params) => {
        const value = params.value;
        if (value === 'male') return 'Male';
        if (value === 'female') return 'Female';
        if (value === 'preferNotToSay') return 'Prefer Not to Say';
        return value || '';
      }
    },
    { field: "category", headerName: "Category", width: 120 },
    {
      field: "exServicemen",
      headerName: "Ex-Servicemen",
      width: 130,
      cellRenderer: (params) => {
        return formatYesNo(params.value);
      }
    },
    {
      field: "speciallyAbled",
      headerName: "Specially Abled",
      width: 150,
      cellRenderer: (params) => {
        const data = params.data;
        if (data && data.speciallyAbledDetails) {
          return `Yes - ${data.speciallyAbledDetails}`;
        }
        if (data && data.speciallyAbledOther) {
          return `Yes - ${data.speciallyAbledOther}`;
        }
        return formatYesNo(params.value);
      }
    },

    // Contact Information
    { field: "contactNumber", headerName: "Contact Number", width: 140 },
    { field: "alternativeContactNumber", headerName: "Alternative Contact", width: 140 },
    { field: "emailAddress", headerName: "Email Address", width: 200 },
    { field: "residentialAddress", headerName: "Residential Address", width: 250 },
    { field: "pinCode", headerName: "Pin Code", width: 100 },

    // Educational Information
    { field: "currentEducationalQualification", headerName: "Educational Qualification", width: 180 },
    { field: "boardUniversity", headerName: "Board/University", width: 180 },
    { field: "yearOfPassing", headerName: "Year of Passing", width: 120 },
    {
      field: "subjectsStudied",
      headerName: "Subjects Studied",
      width: 200,
      valueFormatter: (params) => {
        if (Array.isArray(params.value)) {
          return params.value.join(", ");
        }
        return params.value || '';
      }
    },

    // Course Preferences
    {
      field: "interestCourse",
      headerName: "Interested Course",
      width: 180,
      valueFormatter: (params) => {
        if (params.value) {
          return params.value;
        }
        const data = params.data;
        if (data && data.interestedCourseOther) {
          return data.interestedCourseOther;
        }
        if (data && data._interestedCourseOther) {
          return data._interestedCourseOther;
        }
        return '';
      }
    },
    {
      field: "preferredModeOfLearning",
      headerName: "Preferred Mode",
      width: 130,
      valueFormatter: (params) => {
        const value = params.value;
        if (value === 'Online') return 'Online';
        if (value === 'Offline') return 'Offline';
        return value || '';
      }
    },

    // Schedule Preferences
    { field: "preferredBatchTime", headerName: "Preferred Batch Time", width: 180 },
    { field: "importantNote", headerName: "Important Note", width: 200 },

    // Referral Information
    {
      field: "referralSource",
      headerName: "Referral Source",
      width: 150,
      valueFormatter: (params) => {
        if (params.value) {
          return params.value;
        }
        const data = params.data;
        if (data && data.referralSourceOther) {
          return data.referralSourceOther;
        }
        if (data && data._referralSourceOther) {
          return data._referralSourceOther;
        }
        return '';
      }
    },
    { field: "sourceName", headerName: "Source Name", width: 150 },

    // Goals & Requirements
    { field: "goalsForCourse", headerName: "Goals for Course", width: 180 },
    { field: "futureGoal", headerName: "Future Goal", width: 180 },
    {
      field: "computerAccess",
      headerName: "Computer Access",
      width: 150,
      cellRenderer: (params) => {
        const data = params.data;
        if (data && data.computerAccessDetails) {
          return `Yes - ${data.computerAccessDetails}`;
        }
        if (data && data.computerAccessOther) {
          return `Yes - ${data.computerAccessOther}`;
        }
        return formatYesNo(params.value);
      }
    },

    // Additional fields that might be in the database but not displayed
    {
      field: "speciallyAbledOther",
      headerName: "Specially Abled Details",
      width: 180,
      hide: true
    },
    {
      field: "computerAccessOther",
      headerName: "Computer Access Details",
      width: 180,
      hide: true
    },
    {
      field: "interestedCourseOther",
      headerName: "Other Course Interest",
      width: 180,
      hide: true
    },
    {
      field: "referralSourceOther",
      headerName: "Other Referral Source",
      width: 180,
      hide: true
    },

    // System Information
    {
      field: "createdAt",
      headerName: "Created Date",
      width: 150,
      valueFormatter: (params) => formatDate(params.value)
    },
    {
      field: "updatedAt",
      headerName: "Updated Date",
      width: 150,
      valueFormatter: (params) => formatDate(params.value)
    },
  ]);

  const defaultColDef = useMemo(() => ({
    enableRowGroup: false,
    enableValue: true,
    filter: true,
    sortable: true,
    resizable: true,
    floatingFilter: true,
    autoHeight: true,
    wrapText: true,
  }), []);

  const popupParent = useMemo(() => document.body, []);

  const onGridReady = useCallback((params) => {
    // Set the grid API to the ref for later use
    if (params.api) {
      // Auto-size columns to fit content
      params.api.sizeColumnsToFit();

      // Update row count display if it exists
      const rowCountElement = document.querySelector("#currentRowCount");
      if (rowCountElement && rowData) {
        rowCountElement.textContent = rowData.length.toString();
      }

      // Clear any alerts when data changes
      setError(null);
    }
  }, [rowData]);

  // Export to Excel
  const onExportExcel = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      const params = {
        fileName: `Enquiries_${new Date().toISOString().split('T')[0]}.xlsx`,
        processCellCallback: (params) => {
          // Format dates and boolean values for Excel
          if (params.column.getColDef().field === 'dateOfBirth' || params.column.getColDef().field === 'createdAt') {
            return params.value ? formatDate(params.value) : '';
          }
          if (typeof params.value === 'boolean') {
            return params.value ? 'Yes' : 'No';
          }
          return params.value;
        }
      };
      gridRef.current.api.exportDataAsExcel(params);
    }
  }, []);

  // Export to CSV
  const onExportCSV = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      const params = {
        fileName: `Enquiries_${new Date().toISOString().split('T')[0]}.csv`,
        processCellCallback: (params) => {
          // Format dates and boolean values for CSV
          if (params.column.getColDef().field === 'dateOfBirth' || params.column.getColDef().field === 'createdAt') {
            return params.value ? formatDate(params.value) : '';
          }
          if (typeof params.value === 'boolean') {
            return params.value ? 'Yes' : 'No';
          }
          return params.value;
        }
      };
      gridRef.current.api.exportDataAsCsv(params);
    }
  }, []);

  // 🌟 Global Search Handler
  const onQuickFilterChanged = useCallback((e) => {
    gridRef.current.api.setQuickFilter(e.target.value);
    // Clear any alerts when search changes
    setError(null);
  }, []);

  return (
    <div className="p-4 md:p-8">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={fetchEnquiries}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none flex items-center"
            disabled={loading}
          >
            <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>

          <button
            onClick={onExportExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none flex items-center"
            disabled={loading || rowData.length === 0}
          >
            <FaFileExcel className="mr-2" />
            Excel
          </button>

          <button
            onClick={onExportCSV}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none flex items-center"
            disabled={loading || rowData.length === 0}
          >
            <FaFileCsv className="mr-2" />
            CSV
          </button>

          <div className="font-semibold flex items-center ml-2">
            <span className="hidden md:inline">Row Count = </span>
            <span id="currentRowCount" className="text-blue-600 font-bold text-lg ml-1">{rowData.length}</span>
          </div>
        </div>

        {/* 🔍 Global Search Box */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Global Search..."
              onChange={onQuickFilterChanged}
              className="pl-10 w-full md:w-64 input input-bordered border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Grid in Card */}
      <div className="bg-white shadow-lg rounded-2xl p-4">
        <h2 className="text-xl font-bold mb-4 text-center">Enquiry Table</h2>

        {loading && rowData.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div id="myGrid" className="h-[600px] w-full">
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              domLayout="normal"
              popupParent={popupParent}
              onGridReady={onGridReady}
              pagination={true}
              paginationPageSize={15}
              rowHeight={48}
              headerHeight={48}
              rowStyle={{ borderBottom: '1px solid #e2e8f0' }}
              rowClassRules={{
                'bg-gray-50': (params) => params.rowIndex % 2 === 0,
              }}
              overlayNoRowsTemplate="<div class='p-4 text-center'>No enquiries found. Try adjusting your filters or refreshing the data.</div>"
              overlayLoadingTemplate="<div class='flex justify-center items-center h-full'><div class='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div></div>"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiryGrid;
