import React from "react";
import { TableProps } from "./interface";
import { FaEllipsisV } from "react-icons/fa";

const DataTable: React.FC<TableProps<any>> = ({
  columns,
  data,
  pagination,
  filters,
  actionButtons,
}) => {
  return (
    <div className="overflow-x-auto h-full">
      {filters && <div className="mb-4">{filters}</div>}
      <table className="table w-full">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
            {actionButtons && <th className="flex justify-end">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length + (actionButtons ? 1 : 0)}>
                Nenhum registro encontrado
              </td>
            </tr>
          )}
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column.Cell
                    ? column.Cell(row[column.accessor])
                    : row[column.accessor]}
                </td>
              ))}
              {actionButtons && (
                <th className="flex justify-end">
                  <div className="dropdown dropdown-end">
                    <button
                      className="btn btn-ghost btn-xs dropdown-toggle"
                      tabIndex={0}
                    >
                      <FaEllipsisV />
                    </button>
                    <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                      {actionButtons.map(
                        (button, btnIndex) =>
                          button.show(row) && (
                            <li key={btnIndex}>
                              <button
                                className="btn btn-ghost btn-xs w-full text-left flex justify-start"
                                onClick={() => button.onClick(row)}
                              >
                                <span className="flex justify-between w-full">
                                  {typeof button.label === "function"
                                    ? button.label(row)
                                    : button.label}
                                  {button.icon && button.icon}
                                </span>
                              </button>
                            </li>
                          )
                      )}
                    </ul>
                  </div>
                </th>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && (
        <div className="mt-4 flex justify-center items-center">
          <button
            className="btn"
            disabled={pagination.currentPage <= 1}
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
          >
            Anterior
          </button>
          <span className="mx-2">
            Página {pagination.currentPage} de {pagination.totalPages}
          </span>
          <button
            className="btn"
            disabled={pagination.currentPage >= pagination.totalPages}
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
          >
            Próximo
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
