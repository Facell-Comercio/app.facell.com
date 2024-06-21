import { Skeleton } from "@/components/ui/skeleton";
import { sliceString } from "@/helpers/mask";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { formatDate } from "date-fns";
import { FileSearch2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useStoreLogs } from "./store";

type DataLog = {
  message?: string;
  stack?: string;
  name?: string;
};
export interface Log {
  type: string;
  level: number;
  date: string;
  time: string; // Assuming this is an ISO 8601 formatted date string
  pid: number;
  hostname: string;
  module: string;
  origin: string;
  method: string;
  data: DataLog;
}

interface RowVirtualizerLog {
  data: Log[];
}

const ReactTableVirtualized: React.FC<RowVirtualizerLog> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const openModal = useStoreLogs.getState().openModal;

  const columns = useMemo<ColumnDef<Log>[]>(
    () => [
      {
        accessorKey: "pid",
        header: "AÇÃO",
        cell: (info) => {
          return (
            <div
              title="Ver mais informações"
              className="flex items-center justify-center mx-auto"
            >
              <FileSearch2
                size={20}
                className="text-blue-500 cursor-pointer"
                onClick={() => {
                  openModal(info.getValue<number>().toString());
                }}
              />
            </div>
          );
        },
        size: 40,
      },

      {
        accessorKey: "date",
        header: "DATA",
        cell: (info) => {
          let valor = formatDate(
            info.getValue<string>(),
            "dd/MM/yyyy HH:mm:ss"
          );
          return <div className="uppercase mx-auto">{valor}</div>;
        },
        size: 130,
      },
      {
        accessorKey: "level",
        header: "TIPO",
        cell: (info) => {
          const valor = info.getValue<string>();
          let color = "";
          let texto = "";
          if (parseInt(valor) === 30) {
            color = "text-blue-500";
            texto = "INFO";
          } else if (parseInt(valor) === 40) {
            color = "text-warning";
            texto = "WARNING";
          } else if (parseInt(valor) === 50) {
            color = "text-red-500";
            texto = "ERROR";
          }

          return (
            <div className={`uppercase ${color} font-semibold mx-auto`}>
              {texto}
            </div>
          );
        },

        size: 100,
      },
      {
        accessorKey: "module",
        header: "MÓDULO",
        cell: (info) => {
          let valor = info.getValue<string>();
          return <div className="uppercase mx-auto">{valor}</div>;
        },
        size: 200,
      },
      {
        accessorKey: "origin",
        header: "ORIGEM",
        cell: (info) => {
          let valor = info.getValue<string>();
          return <div className="uppercase mx-auto">{valor}</div>;
        },
        size: 200,
      },
      {
        accessorKey: "method",
        header: "MÉTODO",
        cell: (info) => {
          let valor = info.getValue<string>();
          return <div className="uppercase mx-auto">{valor}</div>;
        },
        size: 200,
      },
      {
        accessorKey: "data",
        header: "MESSAGE",
        cell: (info) => {
          let data = info.getValue<DataLog>();
          return (
            <div className="uppercase">
              {sliceString((data && data.message) || "", 55)}
            </div>
          );
        },
        size: 340,
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
    enableRowSelection: true,
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
              <table className="grid text-nowrap text-xs ">
                <thead className="grid sticky top-0 z-10 border-y bg-background">
                  {table.getHeaderGroups().map((headerGroup, index) => (
                    <tr
                      className="flex w-full"
                      key={"tituloConciliar thead" + headerGroup.id + index}
                    >
                      {headerGroup.headers.map((header, index) => {
                        return (
                          <th
                            className={`py-2`}
                            key={"tituloConciliar th" + header.id + index}
                            colSpan={header.colSpan}
                            style={{
                              width: header.getSize(),
                            }}
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
                    const row = rows[virtualRow.index] as Row<Log>;
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
                        className="bg-background"
                      >
                        {row.getVisibleCells().map((cell, index) => {
                          return (
                            <td
                              className={`flex items-center p-2`}
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
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              Nenhum título encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RowVirtualizedFixed = ({
  data,
  isLoading,
  isError,
}: {
  data: Log[];
  isLoading: boolean;
  isError: boolean;
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

export default RowVirtualizedFixed;
