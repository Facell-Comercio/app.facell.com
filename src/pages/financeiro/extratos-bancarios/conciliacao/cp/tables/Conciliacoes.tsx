import { Skeleton } from "@/components/ui/skeleton";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { normalizeFirstAndLastName } from "@/helpers/mask";
import { useVirtualizer } from "@tanstack/react-virtual";
import { formatDate } from "date-fns";
import { FileSearch2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useStoreConciliacaoCP } from "../components/store";

export type ConciliacoesProps = {
  id: string;
  data_conciliacao: string;
  tipo: string;
  transacoes: number;
  valor_transacoes: number;
  pagamentos: number;
  valor_pagamentos: number;
  responsavel: string;
};

interface RowVirtualizerConciliacoesProps {
  data: ConciliacoesProps[];
}

const ReactTableVirtualized: React.FC<RowVirtualizerConciliacoesProps> = ({
  data,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const openModal = useStoreConciliacaoCP.getState().openModal;

  const columns = useMemo<ColumnDef<ConciliacoesProps>[]>(
    () => [
      {
        header: "AÇÃO",
        accessorKey: "id",
        cell: (info) => (
          <div
            title="Ver conciliação"
            className="flex items-center justify-center"
          >
            <FileSearch2
              size={20}
              className="text-blue-500 cursor-pointer"
              onClick={() => {
                openModal(info.getValue<number>().toString());
              }}
            />
          </div>
        ),
        enableSorting: false,
        size: 40,
      },
      {
        accessorKey: "data_conciliacao",
        header: "CONCILIAÇÃO",
        cell: (info) => {
          let value = formatDate(
            new Date(info.getValue<Date | string>()),
            "dd/MM/yyyy"
          );
          return <div className="w-full text-center">{value}</div>;
        },
        size: 100,
      },
      {
        accessorKey: "tipo",
        header: "TIPO",
        size: 100,
        cell: (info) => {
          let value = info.getValue<number>();
          return <div className="w-full text-center">{value}</div>;
        },
      },
      {
        accessorKey: "valor_transacoes",
        header: "VALOR TRANSAÇÕES",
        size: 100,
        cell: (info) => {
          const valor = parseFloat(info.getValue<string>()).toLocaleString(
            "pt-BR",
            {
              style: "decimal",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          );

          return (
            <div className="flex w-full justify-between">
              <span>R$</span>
              <span>{valor}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "valor_pagamentos",
        header: "VALOR PAGAMENTOS",
        size: 200,
        cell: (info) => {
          const valor = parseFloat(info.getValue<string>()).toLocaleString(
            "pt-BR",
            {
              style: "decimal",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          );

          return (
            <div className="flex w-full justify-between">
              <span>R$</span>
              <span>{valor}</span>
            </div>
          );
        },
      },

      {
        accessorKey: "responsavel",
        header: "RESPONSÁVEL",
        size: 200,
        cell: (info) => {
          const valor = normalizeFirstAndLastName(
            info.getValue<string>().toUpperCase() || ""
          );
          return <div>{valor}</div>;
        },
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
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden border">
        <div
          ref={parentRef}
          className="h-[500px] overflow-auto scroll-thin relative bg-background"
        >
          {data.length > 0 ? (
            <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
              <table className="grid text-nowrap text-xs hover:">
                <thead className="grid sticky top-0 z-10 border-y bg-background">
                  {table.getHeaderGroups().map((headerGroup, index) => (
                    <tr
                      className="flex w-full"
                      key={"transacaoConciliada thead" + headerGroup.id + index}
                    >
                      {headerGroup.headers.map((header, index) => {
                        return (
                          <th
                            className="py-2"
                            key={"transacaoConciliada th" + header.id + index}
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
                    ] as Row<ConciliacoesProps>;
                    return (
                      <tr
                        key={
                          "transacaoConciliada tr" + virtualRow.index + index
                        }
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
                              key={"transacaoConciliada td" + cell.id + index}
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
              Nenhuma transação encontrada
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Conciliacoes = ({
  data,
  isLoading,
  isError,
}: {
  data: ConciliacoesProps[];
  isLoading: boolean;
  isError: boolean;
}) => {
  // @ts-ignore
  const rows = data || [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
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
      <div className="text-red-500 text-center p-1">
        Ocorreu um erro ao tentar buscar os dados!
      </div>
    );
  }

  return (
    <div>
      <ReactTableVirtualized data={rows} />
    </div>
  );
};

export default Conciliacoes;
