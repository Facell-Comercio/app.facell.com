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

import { DatePickerWithRange } from "@/components/ui/date-range";
import { Input } from "@/components/ui/input";
import { normalizeCurrency } from "@/helpers/mask";
import { useVirtualizer } from "@tanstack/react-virtual";
import { formatDate } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { Transacao, useExtratoStore } from "./context";
import { copyToClipboard } from "@/pages/financeiro/contas-pagar/titulos/titulo/helpers/helper";
import { useExtratosStore } from "../../context";

function SearchTransactions({ data }: { data: Transacao[] }) {
  const mes = useExtratosStore().mes;
  const ano = useExtratosStore().ano;
  const firstDay = new Date(parseInt(ano), parseInt(mes)-1, 1)
  const endDay = new Date(parseInt(ano), parseInt(mes), 0)

  const [search, setSearch] = useState<string>("");
  const [periodo, setPeriodo] = useExtratoStore((state) => [
    state.periodo,
    state.setPeriodo,
  ]);

  useEffect(()=>{
    setPeriodo({from: firstDay, to: endDay})
  }, 
  [ano, mes])

  const setTransacoes = useExtratoStore((state) => state.setTransacoes);

  useEffect(() => {
    // @ts-ignore
    const dataFiltered = search
      ? data.filter((row) => {
        if (
          row.id_transacao?.toLowerCase().includes(search.toLowerCase()) ||
          row.descricao?.toLowerCase().includes(search.toLowerCase()) ||
          row.documento?.toLowerCase().includes(search.toLowerCase())
        ) {
          return true;
        } else {
          return false;
        }
      })
      : data;

    // @ts-ignore
    setTransacoes(dataFiltered);
  }, [search]);

  return (
    <div className="flex gap-3 items-center justify-between py-2">
      <h3 className="font-semibold text-lg">Transações</h3>
      <div className="flex flex-wrap justify-end gap-2 w-full">
        <DatePickerWithRange
          date={periodo}
          setDate={setPeriodo}
          className="w-[250px]"
          numberOfMonths={1}
          fromMonth={firstDay}
          toMonth={endDay}
          fromYear={parseInt(ano)}
          toYear={parseInt(ano)}
        />
        <Input
          type={"search"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Procurar..."
          className=" min-w-[10ch] max-w-[25ch]"
        />
      </div>
    </div>
  );
}



function ReactTableVirtualized() {
  const [itemCopiadoClipboard, setItemCopiadoClipboard] = useState<{ row: number | null, campo: string | null }>({ row: null, campo: null })
  const handleCopyValue = (row: number, campo: string, value: string) => {
    copyToClipboard(value)
    setItemCopiadoClipboard({ row, campo })
    setTimeout(() => {
      setItemCopiadoClipboard({ row: null, campo: null })
    }, 3000)
  }

  const [sorting, setSorting] = useState<SortingState>([]);
  const transacoes = useExtratoStore().transacoes;

  const columns = useMemo<ColumnDef<Transacao>[]>(
    () => [
      {
        accessorKey: "data_transacao",
        header: "DATA",
        cell: (info) => {
          let value = formatDate(info.getValue<Date>(), "dd/MM/yyyy");
          return <div className="w-full text-center">{value}</div>;
        },
        size: 80,
      },
      {
        accessorKey: "id_transacao",
        header: "ID",
        size: 120,
        cell: (info) => {
          let value = info.getValue<number>();
          let index = info.row.index;
          const isCopied = index == itemCopiadoClipboard.row && itemCopiadoClipboard.campo == 'id_transacao'
          if (isCopied) {
            return <span className="text-center w-full text-success">Copiado!</span>
          }
          return <div onClick={() => handleCopyValue(index, 'id_transacao', String(value))} className="w-32 text-center truncate cursor-pointer">{value}</div>;
        },
      },
      {
        accessorKey: "documento",
        header: "DOC",
        size: 120,
        cell: (info) => {
          let value = info.getValue<string>();
          let index = info.row.index;
          const isCopied = index == itemCopiadoClipboard.row && itemCopiadoClipboard.campo == 'documento'
          if (isCopied) {
            return <span className="text-center w-full text-success">Copiado!</span>
          }
          return <div onClick={() => handleCopyValue(index, 'documento', value)} className="w-32 text-center truncate cursor-pointer">{value}</div>;
        },
      },
      {
        accessorKey: "tipo_transacao",
        header: "TIPO",
        size: 100,
        cell: (info) => {
          let valor = info.getValue<string>();
          return (
            <div
              className={`w-full text-center ${valor == "DEBIT" ? "text-red-500" : "text-green-500"
                }`}
            >
              {valor}
            </div>
          );
        },
      },
      {
        accessorKey: "valor",
        header: "VALOR",
        size: 120,
        cell: (info) => {
          let valor = parseFloat(info.getValue<string>());
          let tipo = info.row.getValue("tipo_transacao");
          let currency = normalizeCurrency(valor);
          return (
            <div
              className={`w-full  px-2 text-end ${tipo === "DEBIT" ? "text-red-500" : "text-green-500"
                }`}
            >
              {currency}
            </div>
          );
        },
      },
      {
        accessorKey: "descricao",
        header: "DESCRIÇÃO",
        size: 400,
      },
      {
        accessorKey: "nome_user",
        header: "IMPORTADO POR",
        size: 200,
      },
      {
        accessorKey: "created_at",
        header: "IMPORTADO EM",
        size: 120,
        cell: (info) => {
          let data = formatDate(info.getValue<Date>(), "dd/MM/yyyy hh:mm");
          return <div className="w-full text-center">{data}</div>;
        },
      },
    ],
    [transacoes, itemCopiadoClipboard]
  );

  const table = useReactTable({
    data: transacoes,
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
      typeof window !== "undefined" &&
        navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg overflow-hidden border">
        <div
          ref={parentRef}
          className="h-[500px] overflow-auto scroll-thin relative"
        >
          <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
            <table className="grid text-nowrap text-xs">
              <thead className="grid sticky top-0 z-10 border bg-slate-200 dark:bg-gray-800">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr className="flex w-full" key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <th
                          className="py-2"
                          key={header.id}
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
                {transacoes.length > 0 ? (
                  virtualizer.getVirtualItems().map((virtualRow) => {
                    const row = rows[virtualRow.index] as Row<Transacao>;
                    return (
                      <tr
                        key={row.id}
                        style={{
                          display: "flex",
                          position: "absolute",
                          transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                          width: "100%",
                        }}
                      >
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <td
                              className="p-2 border-b"
                              key={cell.id}
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
                    <td>Nenhuma transação a exibir...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const Transacoes = ({
  data,
  isLoading,
  isError,
}: {
  data: Transacao[];
  isLoading: boolean;
  isError: boolean;
}) => {
  const setTransacoes = useExtratoStore().setTransacoes;
  // @ts-ignore
  const rows = data || [];

  useEffect(() => {
    setTransacoes(rows);
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="w-100 h-8" />
        <Skeleton className="h-16" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
        <div className="flex gap-2">
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
      <SearchTransactions data={rows} />
      <ReactTableVirtualized />
    </div>
  );
};

export default Transacoes;
