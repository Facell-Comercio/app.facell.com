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

export type VencimentosConciliarProps = {
  id_conciliacao?: string;
  id_titulo: string;
  id_vencimento: string;
  num_doc: string;
  valor: string;
  nome_fornecedor: string;
  descricao: string;
  filial: string;
  data_pagamento: string;
  valor_pago?: string;
  tipo_baixa?: string;
  tipo: string;
};

interface RowVirtualizerVencimentosConciliarProps {
  data: VencimentosConciliarProps[];
  rowSelection: RowSelectionState;
  vencimentosSelection: String[];
  handleRowSelection: (data: any) => void;
}

const ReactTableVirtualized: React.FC<
  RowVirtualizerVencimentosConciliarProps
> = ({ data, rowSelection, handleRowSelection, vencimentosSelection }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const handlevencimentosSelection =
    useStoreTableConciliacaoCP.getState().handlevencimentosSelection;

  const columns = useMemo<ColumnDef<VencimentosConciliarProps>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => {
          return (
            <div className="flex items-center justify-center">
              <Checkbox
                checked={
                  data.length == vencimentosSelection.length ||
                  (vencimentosSelection.length > 0 && "indeterminate")
                }
                onCheckedChange={(value) =>
                  table.toggleAllPageRowsSelected(!!value)
                }
              />
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="flex items-center justify-center">
              <Checkbox
                {...{
                  checked: vencimentosSelection.includes(
                    row.original.id_vencimento
                  ),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected().toString(),
                }}
                onCheckedChange={() => {
                  handlevencimentosSelection({
                    ...row.original,
                    valor_pago: row.original.valor_pago,
                    tipo_baixa: "PADRÃO",
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
        accessorKey: "id_vencimento",
        header: "ID VENCIMENTO",
        size: 100,
        cell: (info) => {
          let value = info.getValue<number>();
          return <div className="w-full text-center uppercase">{value}</div>;
        },
      },
      {
        accessorKey: "id_titulo",
        header: "ID TÍTULO",
        size: 80,
        cell: (info) => {
          let value = info.getValue<number>();
          return <div className="w-full text-center">{value}</div>;
        },
      },
      {
        accessorKey: "data_pagamento",
        header: "PAGAMENTO",
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
        accessorKey: "valor_pago",
        header: "VALOR",
        size: 80,

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
        accessorKey: "nome_fornecedor",
        header: "FORNECEDOR",
        size: 280,
        cell: (info) => {
          let valor = sliceString(info.getValue<string>(), 40);
          return <div>{valor}</div>;
        },
      },
      {
        accessorKey: "filial",
        header: "FILIAL",
        size: 220,
      },
    ],
    [vencimentosSelection]
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
          id_vencimento: data[+c].id_vencimento,
          descricao: data[+c].descricao,
          nome_fornecedor: data[+c].nome_fornecedor,
          valor: data[+c].valor,
          filial: data[+c].filial,
          tipo_baixa: data[+c].tipo_baixa,
          valor_pago: data[+c].valor_pago,
          data_pagamento: data[+c].data_pagamento,
          tipo: data[+c].tipo,
        }));

        handleRowSelection({
          rowSelection: result,
          vencimentosSelection: titulos,
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
                    ] as Row<VencimentosConciliarProps>;
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
                              className="flex items-center p-2"
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
              Nenhum vencimento encontrado
            </div>
          )}
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
  vencimentosSelection,
  handleRowSelection,
}: {
  data: VencimentosConciliarProps[];
  isLoading: boolean;
  isError: boolean;
  rowSelection: RowSelectionState;
  vencimentosSelection: String[];
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
        vencimentosSelection={vencimentosSelection}
      />
    </div>
  );
};

export default TitulosConciliar;
