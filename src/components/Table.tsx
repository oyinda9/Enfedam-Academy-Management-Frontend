import React from "react";

interface Column {
  headers: string;
  accessor: string;
  className?: string;
}

interface TableProps<T> {
  columns: Column[];
  renderRow: (item: T) => React.ReactNode;
  data: T[];
}
const Table = <T,>({ columns, renderRow, data }: TableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full mt-4 border border-gray-200 rounded-md">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-700 text-sm">
            {columns.map((col) => (
              <th key={col.accessor} className={`p-2 ${col.className || ""}`}>
                {col.headers}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => renderRow(item))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="p-4 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
