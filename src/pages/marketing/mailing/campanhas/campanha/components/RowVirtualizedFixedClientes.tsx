import { Skeleton } from "@/components/ui/skeleton";
import { normalizeDate, normalizeFirstAndLastName } from "@/helpers/mask";
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
import { useMemo, useRef, useState } from "react";

export type ClienteProps = {
  gsm: string;
  gsm_portado: string;
  cpf: string;
  data_ultima_compra: string;
  plano_habilitado: string;
  produto_ultima_compra: string;
  desconto_plano: string;
  valor_caixa: string;
  filial: string;
  uf: string;
  status_plano: string; //
  fidelizacao1: string;
  data_fidelizacao_fid1: string;
  fidelizacao2: string;
  data_fidelizacao_fid2: string;
  fidelizacao3: string;
  data_fidelizacao_fid3: string;
  cliente: string; //
  codigo: string;
  plano_atual: string;
  produto_fidelizado: string; //
  produto_ofertado: string;
  vendedor: string;
};

interface RowVirtualizerCliente {
  data: ClienteProps[];
}

const ReactTableVirtualized: React.FC<RowVirtualizerCliente> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<ClienteProps>[]>(
    () => [
      {
        accessorKey: "gsm",
        header: "GSM",
        size: 100,
      },
      {
        accessorKey: "gsm_portado",
        header: "GSM PORTADO",
        size: 100,
        cell: (info) => {
          const label = info.getValue<string>();
          return <div className="uppercase">{label || "- "}</div>;
        },
      },
      {
        accessorKey: "cpf",
        header: "CPF",
        size: 100,
      },
      {
        accessorKey: "cliente",
        header: "NOME",
        size: 200,
        cell: (info) => {
          const label = info.getValue<string>();
          return <div className="uppercase">{normalizeFirstAndLastName(label)}</div>;
        },
      },
      {
        accessorKey: "plano_habilitado",
        header: "DATA ÚLTIMA COMPRA",
        size: 200,
        cell: (info) => {
          const label = info.getValue<string>();
          return <div className="uppercase truncate">{label}</div>;
        },
      },
      {
        accessorKey: "data_ultima_compra",
        header: "DATA ÚLTIMA COMPRA",
        size: 150,
        cell: (info) => {
          const label = info.getValue<string>();
          return <div className="uppercase">{normalizeDate(label)}</div>;
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
      typeof window !== "undefined" && navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  });

  return (
    <div
      ref={parentRef}
      className="h-[300px] border rounded-md overflow-auto scroll-thin relative bg-background"
    >
      {data.length > 0 ? (
        <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
          <table className="grid text-nowrap text-xs me-2">
            <thead className="grid sticky top-0 z-10 border-y bg-secondary">
              {table.getHeaderGroups().map((headerGroup, index) => (
                <tr className="flex w-full" key={"tituloConciliar thead" + headerGroup.id + index}>
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
                height: `${virtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
                position: "relative", //needed for absolute positioning of rows
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow, index) => {
                const row = rows[virtualRow.index] as Row<ClienteProps>;
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
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
          Nenhum cliente encontrado
        </div>
      )}
    </div>
  );
};

const RowVirtualizedFixedClientes = ({
  data,
  isLoading,
  isError,
}: {
  data: ClienteProps[];
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
      <div className="text-red-500 text-center p-1">Ocorreu um erro ao tentar buscar os dados!</div>
    );
  }

  return <ReactTableVirtualized data={rows} />;
};

export default RowVirtualizedFixedClientes;
