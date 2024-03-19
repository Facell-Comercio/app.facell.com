import React, { useMemo } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import FiltersLancamentosPagar from "./FiltersTitulosPagar";

import { useStoreTablePagar } from "./table-titulos/store-table";
import { useStoreTitulo } from "./titulo/store-titulo";
import { useTituloPagar } from "@/hooks/use-titulo-pagar";
import { FilePlus2 } from "lucide-react";


const SectionTitulosPagar = () => {
  console.log('RENDER - Section-Titulos')

  const {
    rowCount,
    pagination,
    setPagination,
    filters,
    sorting,
    setSorting,
    rowSelection,
    setRowSelection,
    isAllSelected,
  } = useStoreTablePagar(state => ({
    rowCount: state.rowCount,
    filters: state.filters,
    pagination: state.pagination,
    setPagination: state.setPagination,
    sorting: state.sorting,
    setSorting: state.setSorting,
    rowSelection: state.rowSelection,
    setRowSelection: state.setRowSelection,
    isAllSelected: state.isAllSelected
  }))

  const { setModalTituloOpen } = useStoreTitulo(state => ({
    setModalTituloOpen: state.setModalTituloOpen
  }))


  const { data, refetch } = useTituloPagar().getAll({ pagination, filters })


  const columnsTitulos = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="px-1">
            <input
              type="checkbox"
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected().toString(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <input
              type="checkbox"
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected().toString(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: "id",
        header: "ID",
        cell: (info) => (
          <span className='font-semibold cursor-pointer text-blue-500' onClick={() => setModalTituloOpen({ open: true, id_titulo: info.getValue() })}>{info.getValue()}</span>
        ),
        sortDescFirst: true,
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          let status = info.getValue();
          let color = "";
          if (status === "Aprovado") {
            color = "text-green-500";
          } else if (status === "Pago") {
            color = "text-blue-500";
          } else if (status === "Negado") {
            color = "text-red-500";
          }
          return <span className={`${color}`}>{status}</span>;
        },
      },
      {
        header: "solicitação",
        accessorKey: "created_at",
        cell: (info) => {
          let data = info.getValue();
          return new Date(data).toLocaleString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit" });
        },
      },
      {
        header: "vencimento",
        accessorKey: "data_vencimento",
        cell: (info) => {
          let data = info.getValue();
          return new Date(data).toLocaleString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit" });
        },
      },
      {
        header: "Valor",
        accessorKey: "valor",
        cell: (info) => <span className="block text-right">{parseFloat(info.getValue()).toLocaleString("pt-BR", { useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>,
      },
      {
        accessorFn: (row) => row.descricao,
        id: "descricao",
        accessorKey: "descricao",
        cell: (info) => {
          let label = info.getValue();
          return (
            <div title={label} className="block truncate max-w-96">
              {label}
            </div>
          );
        },
        header: "Descrição",
        enableResizing: true,
        width: 1500,
      },
      {
        header: "Fornecedor",
        accessorKey: "fornecedor",
        cell: (info) => {
          let label = info.getValue();
          return (
            <div title={label} className="block truncate max-w-96">
              {label}
            </div>
          );
        },
      },
      {
        header: "solicitante",
        accessorKey: "solicitante",
        cell: (info) => {
          let label = info.getValue();
          return (
            <div title={label} className="block truncate max-w-96">
              {label}
            </div>
          );
        },
      },
    ],
    []
  );


  const defaultData = React.useMemo(() => [], [])

  const table = useReactTable({
    data: data ?? defaultData,
    rowCount: rowCount || 0,
    columns: columnsTitulos,
    state: {
      isAllSelected,
      pagination,
      rowSelection,
      sorting,
    },
    enableRowSelection: true,
    onRowSelectionChange: (callback) => {
      const result = callback(rowSelection)
      setRowSelection(result)
    },
    onPaginationChange: (callback) => {
      const result = callback(pagination)
      setPagination(result)
    },
    onSortingChange: (callback) => {
      const result = callback(sorting)
      setSorting(result)
    },
    getSortedRowModel: getSortedRowModel(),
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    // debugTable: true,
    // debugAll: true

  });



  return (
    <div className="block w-full overflow-auto">

      {/* Ações */}
      <div className="mb-2 flex gap-3">
        <Button onClick={() => { setModalTituloOpen({ open: true, id_titulo: null }) }}><FilePlus2 size={16} className="me-2" /> Nova solicitação</Button>
      </div>

      {/* Filtros */}
      <FiltersLancamentosPagar refetch={refetch} />

      {/* Tabela */}
      <table className="w-auto rounded-lg">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    {...{
                      key: header.id,
                      colSpan: header.colSpan,
                      className: `${header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : ''
                        } border text-left p-1 text-sm bg-gray-100 dark:bg-slate-700 uppercase`,
                    }}

                    onClick={header.column.getToggleSortingHandler()}
                    title={
                      header.column.getCanSort()
                        ? header.column.getNextSortingOrder() === 'asc'
                          ? 'Classificar Ascendente'
                          : header.column.getNextSortingOrder() === 'desc'
                            ? 'Classificar Descendente'
                            : 'Limpar classificação'
                        : undefined
                    }
                  >
                    {header.isPlaceholder ? null : <div>{flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted()] ?? null}
                    </div>}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      {...{
                        key: cell.id,
                        style: {
                          width: cell.width,
                        },
                        className: "border px-1 py-1 text-sm",
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex items-center gap-2 my-3">
        <button className="border rounded p-1" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
          {"<<"}
        </button>
        <button className="border rounded p-1" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {"<"}
        </button>
        <button className="border rounded p-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {">"}
        </button>
        <button className="border rounded p-1" onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Página</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Ir para página:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-12 dark:bg-slate-800"
          />
        </span>
        <select
          className="dark:bg-slate-800 rounded p-1"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 15, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Exibir {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>
        Exibindo {table.getRowModel().rows.length.toLocaleString()} de {table.getRowCount().toLocaleString()} solicitações
      </div>
    </div>
  );
};

export default SectionTitulosPagar;
