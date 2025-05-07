import React, { useMemo } from 'react';
import DataTable from './DataTable';
import FilePreviewTableCell from './FilePreviewTableCell';

/**
 * Table component for displaying student documents
 * 
 * @param {Object} props Component props
 * @param {Array} props.students Array of student data
 * @param {string} props.title Table title
 */
const StudentDocumentsTable = ({ students = [], title = "Student Documents" }) => {
  // Define table columns
  const columns = useMemo(
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
        Header: 'Photo',
        accessor: 'candidatePhoto',
        isFilePreview: true,
        fileType: 'image',
      },
      {
        Header: 'Aadhar',
        accessor: 'aadharPhoto',
        isFilePreview: true,
        fileType: 'pdf',
      },
      {
        Header: 'Signature',
        accessor: 'candidateSignature',
        isFilePreview: true,
        fileType: 'image',
      },
      {
        Header: '10th Marksheet',
        accessor: 'tenthMarksheet',
        isFilePreview: true,
        fileType: 'pdf',
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={students}
      title={title}
      showSearch={true}
      initialPageSize={10}
    />
  );
};

export default StudentDocumentsTable;
