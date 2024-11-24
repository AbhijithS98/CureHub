import React, { useState } from 'react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode; 
}

interface TableWithPaginationProps<T> {
  data: T[]; 
  columns: Column<T>[]; 
  rowsPerPage?: number; 
}

const TableWithPagination = <T extends object>({
  data,
  columns,
  rowsPerPage = 5,
}: TableWithPaginationProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination details
  const totalPages = Math.ceil(data?.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data?.slice(startIndex, startIndex + rowsPerPage);

  // Handle page navigation
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-secondary">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData?.length > 0 ? (
              currentData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => {
                    const value = typeof column.key === 'string' && column.key in row
                    ? row[column.key as keyof T]
                    : undefined;
                    
                    // If a render function is provided for this column, use it
                    if (column.render) {
                      return <td key={String(column.key)}>{column.render(value, row)}</td>;
                    }
    
                    // Otherwise, just display the value
                    return <td key={String(column.key)}>{value as React.ReactNode}</td>;
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-outline-secondary mx-1"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`btn mx-1 ${
                currentPage === index + 1 ? 'btn-primary' : 'btn-outline-secondary'
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="btn btn-outline-secondary mx-1"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TableWithPagination;
