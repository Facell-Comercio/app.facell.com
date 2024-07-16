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
import { sliceString } from "@/helpers/mask";
import { useVirtualizer } from "@tanstack/react-virtual";
import { formatDate } from "date-fns";
import { useMemo, useRef, useState } from "react";
import { useStoreTableConciliacaoCP } from "./store-tables";

export type TransacoesConciliarProps = {
  id_conciliacao?: string;
  id?: string;
  id_transacao: string;
  doc: string;
  valor: string;
  valor_pago?: string;
  descricao: string;
  data_transacao: string;
  conta_bancaria?: string;
};

interface RowVirtualizerTransacoesConciliarProps {
  data: TransacoesConciliarProps[];
  rowSelection: RowSelectionState;
  handleRowSelection: (data: any) => void;
  transacoesSelection: String[];
}

const ReactTableVirtualized: React.FC<
  RowVirtualizerTransacoesConciliarProps
> = ({ data, rowSelection, handleRowSelection, transacoesSelection }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const handleTransacoesSelection =
    useStoreTableConciliacaoCP.getState().handleTransacoesSelection;

  const columns = useMemo<ColumnDef<TransacoesConciliarProps>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={
                data.length == transacoesSelection.length ||
                (transacoesSelection.length > 0 && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
            />
          </div>
        ),
        cell: ({ row }) => {
          return (
            <div className="flex items-center justify-center">
              <Checkbox
                {...{
                  checked: transacoesSelection.includes(
                    row.original.id_transacao
                  ),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected().toString(),
                }}
                onCheckedChange={() => {
                  handleTransacoesSelection({
                    ...row.original,
                  });
                  row.getToggleSelectedHandler();
                }}
              />
            </div>
          );
        },
        size: 30,
      },
      {
        accessorKey: "doc",
        header: "DOC",
        size: 100,
        cell: (info) => {
          let value = info.getValue<number>();
          return <div className="w-full text-center">{value}</div>;
        },
      },
      {
        accessorKey: "data_transacao",
        header: "TRANSAÇÃO",
        cell: (info) => {
          let value = formatDate(
            new Date(info.getValue<Date | string>()),
            "dd/MM/yyyy"
          );
          return <div className="w-full text-center">{value}</div>;
        },
        size: 80,
      },
      {
        accessorKey: "valor",
        header: "VALOR",
        size: 100,
        cell: (info) => {
          let valor = parseFloat(info.getValue<string>()).toLocaleString(
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
        accessorKey: "descricao",
        header: "DESCRIÇÃO",
        size: 350,
        cell: (info) => {
          let valor = sliceString(info.getValue<string>(), 50);
          return <div className="uppercase">{valor}</div>;
        },
      },
      {
        accessorKey: "id_transacao",
        header: "ID",
        size: 100,
        cell: (info) => {
          let value = info.getValue<number>();
          return <div className="w-full text-center">{value}</div>;
        },
      },
    ],
    [transacoesSelection]
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
        const transacoes = Object.keys(result).map((c: string) => ({
          id: data[+c].id,
          id_transacao: data[+c].id_transacao,
          descricao: data[+c].descricao,
          doc: data[+c].doc,
          valor: data[+c].valor,
          valor_pago: data[+c].valor,
          data_transacao: data[+c].data_transacao,
        }));
        handleRowSelection({
          rowSelection: result,
          transacoesSelection: transacoes,
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
          className="h-[500px] overflow-auto scroll-thin relative bg-background"
        >
          {data.length > 0 ? (
            <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
              <table className="grid text-nowrap text-xs hover:">
                <thead className="grid sticky top-0 z-10 border-y bg-background">
                  {table.getHeaderGroups().map((headerGroup, index) => (
                    <tr
                      className="flex w-full"
                      key={"transacaoConciliar thead" + headerGroup.id + index}
                    >
                      {headerGroup.headers.map((header, index) => {
                        return (
                          <th
                            className="py-2"
                            key={"transacaoConciliar th" + header.id + index}
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
                    ] as Row<TransacoesConciliarProps>;
                    return (
                      <tr
                        key={"transacaoConciliar tr" + virtualRow.index + index}
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
                              key={"transacaoConciliar td" + cell.id + index}
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
            <div className="h-full w-full flex items-center justify-center bg-background">
              Nenhuma transação encontrada
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TransacoesConciliar = ({
  data,
  isLoading,
  isError,
  rowSelection,
  transacoesSelection,
  handleRowSelection,
}: {
  data: TransacoesConciliarProps[];
  isLoading: boolean;
  isError: boolean;
  rowSelection: RowSelectionState;
  transacoesSelection: String[];
  handleRowSelection: (data: any) => void;
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
      <ReactTableVirtualized
        data={rows}
        rowSelection={rowSelection}
        handleRowSelection={handleRowSelection}
        transacoesSelection={transacoesSelection}
      />
    </div>
  );
};

export default TransacoesConciliar;
