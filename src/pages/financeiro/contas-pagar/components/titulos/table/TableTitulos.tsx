import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/custom/DataTable";
import { useStoreTablePagar } from "./store-table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowCount: number;
}

export function TableTitulos<TData, TValue>({
  columns,
  data,
  rowCount,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination, rowSelection, setRowSelection] =
    useStoreTablePagar((state) => [
      state.pagination,
      state.setPagination,
      state.rowSelection,
      state.setRowSelection,
    ]);

  return (
    <DataTable
      pagination={pagination}
      setPagination={setPagination}
      columns={columns}
      data={data}
      rowCount={rowCount}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
    />
  );
}
