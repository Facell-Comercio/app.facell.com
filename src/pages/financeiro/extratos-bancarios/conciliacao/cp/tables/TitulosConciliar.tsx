import { Skeleton } from "@/components/ui/skeleton";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { normalizeCurrency } from "@/helpers/mask";
import { useVirtualizer } from "@tanstack/react-virtual";
import { formatDate } from "date-fns";
import { useMemo, useRef, useState } from "react";

export type TitulosConciliarProps = {
  id_titulo: string;
  num_doc: string;
  valor: string;
  nome_fornecedor: string;
  descricao: string;
  filial: string;
  data_pagamento: string;
  valor_pagar?: string;
  tipo_baixa?: string;
};

interface RowVirtualizerTitulosConciliarProps {
  data: TitulosConciliarProps[];
  rowSelection: RowSelectionState;
  handleRowSelection: (data: any) => void;
}

const ReactTableVirtualized: React.FC<RowVirtualizerTitulosConciliarProps> = ({
  data,
  rowSelection,
  handleRowSelection,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<TitulosConciliarProps>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected().toString(),
                onCheckedChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
        size: 30,
      },
      {
        accessorKey: "id_titulo",
        header: "ID",
        size: 60,
        cell: (info) => {
          let value = info.getValue<number>();
          return <div className="w-full text-center">{value}</div>;
        },
      },
      {
        accessorKey: "descricao",
        header: "DESCRIÇÃO",
        size: 350,
      },
      {
        accessorKey: "nome_fornecedor",
        header: "FORNECEDOR",
        size: 300,
      },
      {
        accessorKey: "valor",
        header: "VALOR",
        size: 80,
        cell: (info) => {
          let valor = parseFloat(info.getValue<string>());
          return <div>{normalizeCurrency(valor)}</div>;
        },
      },
      {
        accessorKey: "filial",
        header: "FILIAL",
        size: 300,
      },
      {
        accessorKey: "data_pagamento",
        header: "PAGAMENTO",
        cell: (info) => {
          let value = formatDate(info.getValue<Date>(), "dd/MM/yyyy");
          return <div className="w-full text-center">{value}</div>;
        },
        size: 80,
      },
    ],
    []
  );

  const table = useReactTable({
    data: data,
    columns,
    state: {
      sorting,
      rowSelection: rowSelection || {},
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // debugTable: true,
    enableRowSelection: true,
    onRowSelectionChange: (callback) => {
      // @ts-expect-error ignorado
      const result = callback(rowSelection);
      if (handleRowSelection) {
        const titulos = Object.keys(result).map((c: string) => ({
          id_titulo: data[+c].id_titulo,
          descricao: data[+c].descricao,
          nome_fornecedor: data[+c].nome_fornecedor,
          valor: data[+c].valor,
          filial: data[+c].filial,
          tipo_baixa: "PADRÃO",
          valor_pago: data[+c].valor,
        }));
        console.log(titulos);

        handleRowSelection({
          rowSelection: result,
          titulosSelection: titulos,
        });
      }
    },
  });

  const { rows } = table.getRowModel();

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 30,
    overscan: 10,
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden border">
        <div
          ref={parentRef}
          className="h-[500px] overflow-auto scroll-thin relative"
        >
          <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
            <table className="grid text-nowrap text-xs ">
              <thead className="grid sticky top-0 z-10 border bg-gray-800">
                {table.getHeaderGroups().map((headerGroup, index) => (
                  <tr
                    className="flex w-full"
                    key={"tituloConciliar thead" + headerGroup.id + index}
                  >
                    {headerGroup.headers.map((header, index) => {
                      return (
                        <th
                          className="py-2"
                          key={"tituloConciliar th" + header.id + index}
                          colSpan={header.colSpan}
                          style={{ width: header.getSize() }}
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : "",
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: " 🔼",
                                desc: " 🔽",
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody
                style={{
                  display: "grid",
                  height: `${virtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
                  position: "relative", //needed for absolute positioning of rows
                }}
              >
                {data.length > 0 ? (
                  virtualizer.getVirtualItems().map((virtualRow, index) => {
                    const row = rows[
                      virtualRow.index
                    ] as Row<TitulosConciliarProps>;
                    return (
                      <tr
                        key={"tituloConciliar tr" + virtualRow.index + index}
                        data-index={index}
                        style={{
                          display: "flex",
                          position: "absolute",
                          transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                          width: "100%",
                        }}
                      >
                        {row.getVisibleCells().map((cell, index) => {
                          return (
                            <td
                              className="flex virtualRows-center p-2 border-b"
                              key={"tituloConciliar td" + cell.id + index}
                              style={{
                                display: "flex",
                                width: cell.column.getSize(),
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                ) : (
                  <tr className="flex w-full items-center p-6">
                    <td>Nenhum título a exibir...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const TitulosConciliar = ({
  data,
  isLoading,
  isError,
  rowSelection,
  handleRowSelection,
}: {
  data: TitulosConciliarProps[];
  isLoading: boolean;
  isError: boolean;
  rowSelection: RowSelectionState;
  handleRowSelection: (data: any) => void;
}) => {
  // @ts-ignore
  const rows = data || [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="w-100 h-8" />
        <Skeleton className="h-16" />
        <div className="flex flex-col w-full gap-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    );
  }
  if (!data) {
    return null;
  }

  if (isError) {
    return (
      <div className="text-red-500">
        Ocorreu um erro ao tentar buscar os dados!
      </div>
    );
  }

  return (
    <div>
      <ReactTableVirtualized
        data={rows}
        rowSelection={rowSelection}
        handleRowSelection={handleRowSelection}
      />
    </div>
  );
};

export default TitulosConciliar;
