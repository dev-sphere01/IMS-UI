import React, { useState, useEffect, useMemo } from 'react';
import { FaUserGraduate } from 'react-icons/fa';
import DataTable from '../../components/tables/DataTable';
import StudentDocumentsTable from '../../components/tables/StudentDocumentsTable';
import StudentService from '../../Services/StudentService';
import { createColumnsWithFilePreviews } from '../../utils/tableUtils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentsTable = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await StudentService.getAllStudents();
        setStudents(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load students data. Please try again later.');
        toast.error('Failed to load students data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Define file fields mapping
  const fileFields = {
    'candidatePhoto': 'image',
    'aadharPhoto': 'pdf',
    'candidateSignature': 'image',
    'tenthMarksheet': 'pdf',
    'twelfthMarksheet': 'pdf',
    'candidateLeftThumbImpression': 'image'
  };

  // Define base table columns
  const baseColumns = useMemo(
    () => [
      {
        Header: 'Reg No',
        accessor: 'regNo',
      },
      {
        Header: 'Name',
        accessor: 'fullName',
      },
      {
        Header: 'Contact',
        accessor: 'contactNumber',
      },
      {
        Header: 'Course',
        accessor: 'courseApplied',
      },
      {
        Header: 'Photo',
        accessor: 'candidatePhoto',
      },
      {
        Header: 'Aadhar',
        accessor: 'aadharPhoto',
      },
      {
        Header: 'Signature',
        accessor: 'candidateSignature',
      },
      {
        Header: '10th Marksheet',
        accessor: 'tenthMarksheet',
      },
    ],
    []
  );

  // Create columns with file previews
  const columns = useMemo(
    () => createColumnsWithFilePreviews(baseColumns, fileFields),
    [baseColumns]
  );

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <FaUserGraduate className="text-purple-600 text-3xl mr-3" />
        <h2 className="text-2xl font-semibold text-gray-800">Students</h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Regular table with all student data */}
          <DataTable
            columns={columns}
            data={students}
            title="Students List"
            showSearch={true}
            initialPageSize={10}
          />

          {/* Specialized table for student documents */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Student Documents</h3>
            <p className="text-gray-600 mb-4">
              This table shows student documents with preview functionality. Click on the eye icon to preview the document.
            </p>
            <StudentDocumentsTable
              students={students}
              title="Student Documents"
            />
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default StudentsTable;
