import { cn } from "@/lib/utils";
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
import { useEffect, useRef, useState } from "react";

type TableProps = {
  data: any;
  columns: ColumnDef<unknown, any>[];
  className?: string;
  divClassName?: string;
  isLoading?: boolean;
  variant?: "default" | "secondary";
  headerTextPosition?: "left" | "right" | "center";
};
export const DataVirtualTableHeaderFixed = ({
  data,
  columns,
  className,
  divClassName,
  isLoading,
  variant,
  headerTextPosition = "center",
}: TableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

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
    estimateSize: () => 33,
    overscan: 10,
    measureElement:
      typeof window !== "undefined" && navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  });

  useEffect(() => {}, [isLoading]);

  return (
    <div className="flex flex-col gap-3 overflow-hidden">
      <div className={`rounded-lg overflow-auto z-40 scroll-thin w-full ${divClassName}`}>
        <div
          ref={parentRef}
          className={cn(`h-[200px] overflow-auto scroll-thin z-50 relative min-w-full`, className)}
        >
          <div
            style={{
              height: `${isLoading ? 200 : virtualizer.getTotalSize()}px`,
            }}
          >
            <table className="grid text-nowrap text-xs w-full">
              <thead className="grid sticky top-0 z-30 border text-foreground bg-slate-300 dark:bg-gray-900 px-2">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr className={`flex w-full text-${headerTextPosition}`} key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <th
                          className="py-2 flex w-full"
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{
                            width: header.getSize(),
                          }}
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? "cursor-pointer select-none w-full"
                                  : "w-full",
                                onClick: header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
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
                  height: `${isLoading ? 200 : virtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
                  position: "relative", //needed for absolute positioning of rows
                }}
              >
                {data?.length > 0 && !isLoading ? (
                  virtualizer.getVirtualItems().map((virtualRow) => {
                    const row = rows[virtualRow.index] as Row<any>;
                    return (
                      <tr
                        key={row.id}
                        className={`flex absolute items-center border-b border-gray-900 transition-all hover:bg-secondary/60 h-[33px] ${
                          variant === "secondary" && "odd:bg-secondary/60 even:bg-secondary/40"
                        }`}
                        style={{
                          transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                          width: "100%",
                        }}
                      >
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <td
                              className="px-2 py-1 flex transition-all "
                              key={cell.id}
                              style={{
                                width: cell.column.getSize(),
                              }}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                ) : (
                  <tr className="flex w-full items-center p-6">
                    {isLoading ? <td>Carregando...</td> : <td>Nenhuma linha a exibir...</td>}
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
