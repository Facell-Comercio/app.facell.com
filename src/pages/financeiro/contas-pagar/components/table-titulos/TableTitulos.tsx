import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useStoreTablePagar } from "./store-table"
import { PaginationTableTitulos } from "./PaginationTable"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  rowCount: number
}

export function TableTitulos<TData, TValue>({
  columns,
  data,
  rowCount
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = useStoreTablePagar(state => [state.sorting, state.setSorting])
  const [pagination, setPagination] = useStoreTablePagar(state => [state.pagination, state.setPagination])

  const table = useReactTable({
    data,
    rowCount: rowCount || 0,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: (callback) => {
      // @ts-expect-error ignorado
      const result = callback(sorting)
      setSorting(result)
    },
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination
    },
    onPaginationChange: (callback) => {
      // @ts-expect-error ignorado
      const result = callback(pagination)
      setPagination(result)
    },
    manualPagination: true,
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {

                return (
                  <TableHead key={header.id}
                    onClick={() => header.column.toggleSorting()}
                    className="text-nowrap cursor-pointer"
                  >
                    {header.isPlaceholder
                      ? null
                      : <div>{flexRender(header.column.columnDef.header, header.getContext())}
                        {/* Se for do tipo id não reenderiza os ícones */}
                        {!(header.id === "select") && header.column.getIsSorted() === 'asc' && ' 🔼'}
                        {!(header.id === "select") && header.column.getIsSorted() === 'desc' && ' 🔽'}

                      </div>}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <PaginationTableTitulos table={table} />
    </div>
  )
}