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
  } from "ag-grid-community";
  import {
    ColumnMenuModule,
    ColumnsToolPanelModule,
    ContextMenuModule,
    RowGroupingModule,
  } from "ag-grid-enterprise";
  import StudentService from "../../Services/StudentService";
  import FilePreviewTableCell from "../../components/tables/FilePreviewTableCell";

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

  function createRow(index) {
    const makes = ["Toyota", "Ford", "BMW", "Phantom", "Porsche"];
    return {
      formNo: `F-${index}-${Math.floor(Math.random() * 1000)}`,
      centreCode: `C-${index}`,
      employeeId: `E-${index}-${Math.floor(Math.random() * 1000)}`,
      otherInfo: `Info-${index}`,
      generatedRegNo: `R-${index}-${Math.floor(Math.random() * 1000)}`,
      fullName: `Name-${index}`,
      dateOfBirth: new Date(),
      gender: index % 2 === 0 ? "Male" : "Female",
      category: "General",
      aadharNo: `1234-${index}-${Math.floor(Math.random() * 10000)}`,
      aadharPhoto: "URL",
      candidatePhoto: "URL",
      candidateSignature: "URL",
      candidateLeftThumbImpression: "URL",
      apaarId: `AP-${index}`,
      religion: "Hindu",
      exServicemen: index % 2 === 0,
      speciallyAbled: index % 3 === 0,
      contactNumber: `123456789${index}`,
      alternateContactNumber: `987654321${index}`,
      emailAddress: `email${index}@example.com`,
      state: "State",
      district: "District",
      residentialAddress: `Address-${index}`,
      pinCode: `12345${index}`,
      fathersName: `Father-${index}`,
      fathersOccupation: "Occupation",
      fathersJobRole: "Job Role",
      departmentOrCompany: "Department",
      mothersName: `Mother-${index}`,
      highestEducationalQualification: "Qualification",
      boardOrUniversity: "University",
      yearOfPassing: "2023",
      subjectsStudied: "Subjects",
      tenthMarksheet: "URL",
      twelfthMarksheet: "URL",
      courseApplied: "Course",
      preferredModeOfLearning: "Online",
      totalFee: Math.floor(Math.random() * 100000),
      discount: Math.floor(Math.random() * 100),
      importantNoteRelatedToTime: "Note",
      referalName: `Referral-${index}`,
      regNo: `REG-${index}`,
      january: Math.floor(Math.random() * 1000),
      february: Math.floor(Math.random() * 1000),
      march: Math.floor(Math.random() * 1000),
      april: Math.floor(Math.random() * 1000),
      may: Math.floor(Math.random() * 1000),
      june: Math.floor(Math.random() * 1000),
      july: Math.floor(Math.random() * 1000),
      august: Math.floor(Math.random() * 1000),
      september: Math.floor(Math.random() * 1000),
      october: Math.floor(Math.random() * 1000),
      november: Math.floor(Math.random() * 1000),
      december: Math.floor(Math.random() * 1000),
      balanceFee: Math.floor(Math.random() * 1000),
      courses: "Course List",
      tShirt: index % 2 === 0,
      itTools: index % 3 === 0,
      webDesigning: index % 4 === 0,
      tally: index % 5 === 0,
      gfxDtp: index % 6 === 0,
      python: index % 7 === 0,
      iot: index % 8 === 0,
      status: "Active",
      month: "January",
    };
  }

  function getData(count) {
    const rowData = [];
    for (let i = 0; i < count; i++) {
      rowData.push(createRow(i));
    }
    return rowData;
  }

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

  // Boolean Cell Renderer Component
  const BooleanCellRenderer = (props) => {
    const value = props.value;
    let displayValue = 'No';

    if (typeof value === 'boolean') {
      displayValue = value ? 'Yes' : 'No';
    } else if (value === 'yes' || value === 'true' || value === true || value === 1) {
      displayValue = 'Yes';
    } else if (value === 'no' || value === 'false' || value === false || value === 0) {
      displayValue = 'No';
    }

    return <span>{displayValue}</span>;
  };

  // File Cell Renderer Component
  const FileCellRenderer = (props) => {
    return (
      <FilePreviewTableCell
        value={props.value}
        fileType={props.colDef?.fileType}
        label={props.colDef?.headerName}
      />
    );
  };

  const AdmissionTable = () => {
    const gridRef = useRef(null);

    // State for data and loading
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data when component mounts
    useEffect(() => {
      fetchStudents();
    }, []);

    // Function to fetch students from the API
    const fetchStudents = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        console.log('Fetching students...');
        const response = await StudentService.getAllStudents();
        console.log('Students fetched:', response);

        if (response && response.success) {
          const data = response.data || [];
          console.log(`Received ${data.length} students`);
          setRowData(data);
        } else {
          console.error('API response indicates failure or invalid format:', response);
          setError('Failed to fetch students. The server response was invalid.');
        }
      } catch (err) {
        console.error('Error fetching students:', err);
        setError(err.response?.data?.message || 'An error occurred while fetching students');
      } finally {
        setLoading(false);
      }
    };
    const [columnDefs] = useState([
      { field: "timestamp", headerName: "Timestamp", filter: "agDateColumnFilter" },
      { field: "formNo", headerName: "Form No" },
      { field: "centerCode", headerName: "Center Code" },
      { field: "employeeId", headerName: "Employee ID" },
      { field: "otherInfo", headerName: "Other Info" },
      { field: "generatedRegNo", headerName: "Generated Reg No" },
      { field: "fullName", headerName: "Full Name" },
      { field: "dob", headerName: "Date of Birth", filter: "agDateColumnFilter" },
      { field: "gender", headerName: "Gender" },
      { field: "category", headerName: "Category" },
      { field: "aadharNo", headerName: "Aadhar No" },
      { field: "religion", headerName: "Religion" },
      {
        field: "aadharPhoto",
        headerName: "Aadhar Photo",
        cellRenderer: FileCellRenderer,
        fileType: "aadhar"
      },
      {
        field: "candidatePhoto",
        headerName: "Candidate Photo",
        cellRenderer: FileCellRenderer,
        fileType: "photo"
      },
      {
        field: "candidateSignature",
        headerName: "Candidate Signature",
        cellRenderer: FileCellRenderer,
        fileType: "signature"
      },
      {
        field: "candidateLeftThumbImpression",
        headerName: "Left Thumb Impression",
        cellRenderer: FileCellRenderer,
        fileType: "thumbprint"
      },
      { field: "apaarId", headerName: "APAAR ID" },
      {
        field: "tenthMarksheet",
        headerName: "10th Marksheet",
        cellRenderer: FileCellRenderer,
        fileType: "document"
      },
      {
        field: "twelfthMarksheet",
        headerName: "12th Marksheet",
        cellRenderer: FileCellRenderer,
        fileType: "document"
      },
      { field: "exServicemen", headerName: "Ex-Servicemen", cellRenderer: BooleanCellRenderer },
      { field: "speciallyAbled", headerName: "Specially Abled", cellRenderer: BooleanCellRenderer },
      { field: "speciallyAbledOther", headerName: "Specially Abled Other" },
      { field: "contactNumber", headerName: "Contact Number" },
      { field: "alternateContactNumber", headerName: "Alternate Contact Number" },
      { field: "emailAddress", headerName: "Email Address" },
      { field: "state", headerName: "State" },
      { field: "district", headerName: "District" },
      { field: "address", headerName: "Address" },
      { field: "pinCode", headerName: "Pin Code" },
      { field: "fathersName", headerName: "Father's Name" },
      { field: "fathersOccupation", headerName: "Father's Occupation" },
      { field: "fathersJobRole", headerName: "Father's Job Role" },
      { field: "departmentOrCompany", headerName: "Department/Company" },
      { field: "mothersName", headerName: "Mother's Name" },
      { field: "guardianName", headerName: "Guardian Name" },
      { field: "guardianRelation", headerName: "Guardian Relation" },
      { field: "guardianContactNumber", headerName: "Guardian Contact Number" },
      { field: "highestEducationalQualification", headerName: "Highest Qualification" },
      { field: "boardOrUniversity", headerName: "Board/University" },
      { field: "yearOfPassing", headerName: "Year of Passing" },
      { field: "subjectsStudied", headerName: "Subjects Studied" },
      { field: "courseApplied", headerName: "Course Applied" },
      { field: "preferredModeOfLearning", headerName: "Preferred Mode of Learning" },
      { field: "tShirt", headerName: "T-Shirt", cellRenderer: BooleanCellRenderer },
      { field: "itTools", headerName: "IT Tools", cellRenderer: BooleanCellRenderer },
      { field: "webDesigning", headerName: "Web Designing", cellRenderer: BooleanCellRenderer },
      { field: "tally", headerName: "Tally", cellRenderer: BooleanCellRenderer },
      { field: "gfxDtp", headerName: "GFX DTP", cellRenderer: BooleanCellRenderer },
      { field: "python", headerName: "Python", cellRenderer: BooleanCellRenderer },
      { field: "iot", headerName: "IoT", cellRenderer: BooleanCellRenderer },
      { field: "referralSource", headerName: "Referral Source" },
      { field: "referralSourceOther", headerName: "Referral Source Other" },
      { field: "referalName", headerName: "Referral Name" },
      { field: "computerAccess", headerName: "Computer Access" },
      { field: "computerAccessOther", headerName: "Computer Access Other" },
      { field: "totalFee", headerName: "Total Fee", filter: "agNumberColumnFilter" },
      { field: "discount", headerName: "Discount", filter: "agNumberColumnFilter" },
      { field: "netFee", headerName: "Net Fee", filter: "agNumberColumnFilter" },
      { field: "paidFee", headerName: "Paid Fee", filter: "agNumberColumnFilter" },
      { field: "remainingFee", headerName: "Remaining Fee", filter: "agNumberColumnFilter" },
      { field: "paymentMethod", headerName: "Payment Method" },
      { field: "transactionId", headerName: "Transaction ID" },
      { field: "paymentDate", headerName: "Payment Date", filter: "agDateColumnFilter" },
      { field: "importantNoteRelatedToTime", headerName: "Important Note" },
      { field: "status", headerName: "Status" },
      { field: "regNo", headerName: "Registration No" },
      { field: "month", headerName: "Month" },
      { field: "january", headerName: "January", filter: "agNumberColumnFilter" },
      { field: "february", headerName: "February", filter: "agNumberColumnFilter" },
      { field: "march", headerName: "March", filter: "agNumberColumnFilter" },
      { field: "april", headerName: "April", filter: "agNumberColumnFilter" },
      { field: "may", headerName: "May", filter: "agNumberColumnFilter" },
      { field: "june", headerName: "June", filter: "agNumberColumnFilter" },
      { field: "july", headerName: "July", filter: "agNumberColumnFilter" },
      { field: "august", headerName: "August", filter: "agNumberColumnFilter" },
      { field: "september", headerName: "September", filter: "agNumberColumnFilter" },
      { field: "october", headerName: "October", filter: "agNumberColumnFilter" },
      { field: "november", headerName: "November", filter: "agNumberColumnFilter" },
      { field: "december", headerName: "December", filter: "agNumberColumnFilter" },
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
      setRowData(getData(rowCount));
      document.querySelector("#currentRowCount").textContent = `${rowCount}`;
    }, []);

    const cbFloatingRows = useCallback(() => {
      const show = document.getElementById("floating-rows").checked;
      if (show) {
        gridRef.current.api.setGridOption("pinnedTopRowData", [
          createRow(999),
          createRow(998),
        ]);
        gridRef.current.api.setGridOption("pinnedBottomRowData", [
          createRow(997),
          createRow(996),
        ]);
      } else {
        gridRef.current.api.setGridOption("pinnedTopRowData", undefined);
        gridRef.current.api.setGridOption("pinnedBottomRowData", undefined);
      }
    }, []);

    const setAutoHeight = useCallback(() => {
      gridRef.current.api.setGridOption("domLayout", "autoHeight");
      document.querySelector("#myGrid").style.height = "";
    }, []);

    const setFixedHeight = useCallback(() => {
      gridRef.current.api.setGridOption("domLayout", "normal");
      document.querySelector("#myGrid").style.height = "400px";
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
          <h2 className="text-xl font-bold mb-4 text-center">Admission Table</h2>
          <div id="myGrid" className="h-[500px] w-full">
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              domLayout="normal"
              popupParent={popupParent}
              onGridReady={onGridReady}
              components={{
                BooleanCellRenderer: BooleanCellRenderer,
                FileCellRenderer: FileCellRenderer
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  export default AdmissionTable;
