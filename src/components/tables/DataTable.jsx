import React, { useState, useMemo } from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { FaSort, FaSortUp, FaSortDown, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import FilePreviewTableCell from './FilePreviewTableCell';

/**
 * Reusable data table component with sorting, pagination, and filtering
 * 
 * @param {Object} props Component props
 * @param {Array} props.columns Table columns configuration
 * @param {Array} props.data Table data
 * @param {string} props.title Table title
 * @param {boolean} props.showSearch Whether to show search input
 * @param {number} props.initialPageSize Initial page size
 * @param {Array} props.pageSizeOptions Page size options
 */
const DataTable = ({ 
  columns, 
  data, 
  title, 
  showSearch = true,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50]
}) => {
  const [filterInput, setFilterInput] = useState('');
  
  // Process columns to handle file preview cells
  const processedColumns = useMemo(() => {
    return columns.map(column => {
      // If the column is a file preview column, add a custom Cell renderer
      if (column.isFilePreview) {
        return {
          ...column,
          Cell: ({ value }) => (
            <FilePreviewTableCell 
              value={value} 
              fileType={column.fileType} 
              label={column.Header} 
            />
          )
        };
      }
      return column;
    });
  }, [columns]);
  
  // Set up react-table
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns: processedColumns,
      data,
      initialState: { pageIndex: 0, pageSize: initialPageSize }
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  
  // Handle search input change
  const handleFilterChange = e => {
    const value = e.target.value || '';
    setGlobalFilter(value);
    setFilterInput(value);
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Table Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between">
        {title && (
          <h3 className="text-lg font-medium text-gray-700">{title}</h3>
        )}
        
        {showSearch && (
          <div className="relative mt-2 sm:mt-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              value={filterInput}
              onChange={handleFilterChange}
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm"
            />
          </div>
        )}
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      {column.render('Header')}
                      <span className="ml-1">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <FaSortDown className="text-gray-400" />
                          ) : (
                            <FaSortUp className="text-gray-400" />
                          )
                        ) : (
                          column.canSort && <FaSort className="text-gray-300" />
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="hover:bg-gray-50">
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              !canPreviousPage ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              !canNextPage ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{page.length > 0 ? pageIndex * pageSize + 1 : 0}</span> to{' '}
              <span className="font-medium">
                {Math.min((pageIndex + 1) * pageSize, data.length)}
              </span>{' '}
              of <span className="font-medium">{data.length}</span> results
            </p>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Rows per page:</span>
              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              >
                {pageSizeOptions.map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                    !canPreviousPage ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                
                {pageOptions.length > 0 && pageOptions.length <= 7 ? (
                  // Show all page numbers if there are 7 or fewer
                  pageOptions.map(i => (
                    <button
                      key={i}
                      onClick={() => gotoPage(i)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        i === pageIndex
                          ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))
                ) : (
                  // Show limited page numbers with ellipsis for many pages
                  <>
                    <button
                      onClick={() => gotoPage(0)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageIndex === 0
                          ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      1
                    </button>
                    
                    {pageIndex >= 3 && (
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    )}
                    
                    {pageIndex > 0 && pageIndex < pageCount - 1 && (
                      <button
                        onClick={() => gotoPage(pageIndex)}
                        className="z-10 bg-purple-50 border-purple-500 text-purple-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                      >
                        {pageIndex + 1}
                      </button>
                    )}
                    
                    {pageIndex < pageCount - 3 && (
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    )}
                    
                    {pageCount > 1 && (
                      <button
                        onClick={() => gotoPage(pageCount - 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pageIndex === pageCount - 1
                            ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageCount}
                      </button>
                    )}
                  </>
                )}
                
                <button
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                    !canNextPage ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
