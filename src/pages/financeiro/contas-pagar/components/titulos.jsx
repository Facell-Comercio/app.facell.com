import React, { useMemo, useState, HTMLAttributes, HTMLProps } from "react";
import { useApi } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

const TitulosPagar = () => {
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
  const {
    financeiro: {
      contasPagar: { fetchTitulos },
    },
  } = useApi();
  const { data, error, isLoading, isError } = useQuery({ queryKey: ["fin_cp_titulos", pagination], queryFn: () => fetchTitulos(pagination), retry: false });

  const columns = useMemo(
    () => [
        {
            id: "select",
            header: ({table})=>(
            <Checkbox 
            {...{
                checked: table.getIsAllRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />
            ),
            cell: ({ row }) => (
            <div className="px-1">
              <Checkbox
                {...{
                  checked: row.getIsSelected(),
                  disabled: !row.getCanSelect(),
                  onChange: row.getToggleSelectedHandler(),
                }}
              />
            </div>
          ),
        },
      {
        accessorKey: "id",
        header: "Num",
        cell: (info) => info.getValue(),
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
          return <div title={label} className="block truncate max-w-96">{label}</div>;
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
            return <div title={label} className="block truncate max-w-96">{label}</div>;
          },
      },
      {
        header: "solicitante",
        accessorKey: "solicitante",
        cell: (info) => {
            let label = info.getValue();
            return <div title={label} className="block truncate max-w-96">{label}</div>;
          },
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.rows ?? [],
    rowCount: data?.rowCount,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    debugTable: true,
  });

  if (isError) {
    return <h1>Ocorreu o seguinte erro {error.message}</h1>;
  }
  if (isLoading) {
    return <h1>Buscando as solicitações...</h1>;
  }

  return (
    <div className="block w-full overflow-auto">
      <table
        className="w-auto rounded-lg"
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    {...{
                      key: header.id,
                      colSpan: header.colSpan,
                      style: {
                        width: header.width,
                      },
                      className: "border text-left p-1 text-sm bg-gray-100 dark:bg-slate-700 uppercase",
                    }}
                  >
                    {header.isPlaceholder ? null : <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>}
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

export default TitulosPagar;
