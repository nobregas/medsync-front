import type { ReactNode } from "react";

export type CrudTableColumn<T> = {
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
};

type CrudTableProps<T> = {
  items: T[];
  columns: CrudTableColumn<T>[];
  getRowKey: (item: T) => string;
  className?: string;
  minWidth?: number;
};

export function CrudTable<T,>({
  items,
  columns,
  getRowKey,
  className = "",
  minWidth,
}: CrudTableProps<T>) {
  return (
    <div className="table-responsive">
      <table className={`crud-table ${className}`} style={minWidth ? { minWidth } : undefined}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th className={column.className} key={`${column.header}-${index}`} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={getRowKey(item)}>
              {columns.map((column, index) => (
                <td className={column.className} key={`${column.header}-${index}`}>
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
