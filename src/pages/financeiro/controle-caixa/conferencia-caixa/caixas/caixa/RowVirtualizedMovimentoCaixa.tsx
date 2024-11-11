import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { normalizeCurrency } from "@/helpers/mask";
import { MovimentoCaixaProps } from "@/hooks/financeiro/useConferenciasCaixa";
import { useVirtualizer } from "@tanstack/react-virtual";
import { formatDate } from "date-fns";
import { useMemo, useRef, useState } from "react";

interface RowVirtualizerMovimentoCaixaProps {
  data: MovimentoCaixaProps[];
}

const ReactTableVirtualized: React.FC<RowVirtualizerMovimentoCaixaProps> = ({
  data,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<MovimentoCaixaProps>[]>(
    () => [
      {
        accessorKey: "data",
        header: "HORA",
        size: 100,
        cell: (info) => {
          let value = formatDate(info.getValue<string | Date>(), "HH:mm:ss");
          return <div className="w-full text-center">{value}</div>;
        },
      },
      {
        accessorKey: "documento",
        header: "Documento",
        cell: (info) => {
          let value = info.getValue<string>();

          return <div className="w-full text-center">{value}</div>;
        },
        size: 200,
      },
      {
        accessorKey: "tipo_operacao",
        header: "Tipo",
        cell: (info) => {
          let value = info.getValue<string>();

          return <div className="w-full text-center">{value}</div>;
        },
        size: 200,
      },
      {
        accessorKey: "forma_pagamento",
        header: "Forma Pagamento",
        cell: (info) => {
          let value = info.getValue<string>();

          return <div className="w-full text-center truncate">{value}</div>;
        },
        size: 200,
      },
      {
        accessorKey: "historico",
        header: "Histórico",
        cell: (info) => {
          let value = info.getValue<string>();

          return <div className="w-full text-center truncate">{value}</div>;
        },
        size: 300,
      },
      {
        accessorKey: "valor",
        header: "Valor",
        cell: (info) => {
          let value = normalizeCurrency(info.getValue<string>());

          return <div className="w-full text-center">{value}</div>;
        },
        size: 200,
      },
    ],
    []
  );

  const table = useReactTable({
    data: data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // debugTable: true,
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
    <div className="flex flex-col gap-3 ">
      <div className="overflow-hidden rounded-md">
        <div
          ref={parentRef}
          className="h-[500px] overflow-auto scroll-thin relative bg-background"
        >
          {data && data.length > 0 ? (
            <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
              <table className="grid text-nowrap text-xs hover:">
                <thead className="grid sticky top-0 z-10 border-y bg-secondary uppercase">
                  {table.getHeaderGroups().map((headerGroup, index) => (
                    <tr
                      className="flex w-full"
                      key={"movimentoCaixa thead" + headerGroup.id + index}
                    >
                      {headerGroup.headers.map((header, index) => {
                        return (
                          <th
                            className="py-2"
                            key={"movimentoCaixa th" + header.id + index}
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
                                }[header.column.getIsSorted() as string] ??
                                  null}
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
                  {virtualizer.getVirtualItems().map((virtualRow, index) => {
                    const row = rows[
                      virtualRow.index
                    ] as Row<MovimentoCaixaProps>;
                    return (
                      <tr
                        key={"movimentoCaixa tr" + virtualRow.index + index}
                        style={{
                          display: "flex",
                          position: "absolute",
                          transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                          width: "100%",
                        }}
                        className="bg-background"
                      >
                        {row.getVisibleCells().map((cell, index) => {
                          return (
                            <td
                              className="flex items-center p-2 "
                              key={"movimentoCaixa td" + cell.id + index}
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
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              Nenhum moviemento encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RowVirtualizedMovimentoCaixa = ({
  data,
}: {
  data: MovimentoCaixaProps[];
}) => {
  // @ts-ignore
  const rows = data || [];

  if (!data) {
    return null;
  }

  return <ReactTableVirtualized data={rows} />;
};

export default RowVirtualizedMovimentoCaixa;
