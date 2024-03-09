import React, { useMemo, useState, HTMLAttributes, HTMLProps, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range";
import { Button } from "@/components/ui/button";
import { EraserIcon, FilePlus2, Filter, FilterIcon } from "lucide-react";
import SelectGrupoEconomico from "@/components/ui/select-grupo-economico";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const TitulosPagar = () => {
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
  const initialFilters = {
    id: null,
    id_grupo_economico: null,
    id_status: null,
    tipo_data: 'data_vencimento',
    range_data: {from: undefined, to: undefined},
    descricao: '',
    nome_user: null,
  }
  const [filters, setFilters] = useState(initialFilters);

  useEffect(()=>{
    console.log(filters)
  }, [filters])

  const handleClickFilter = ()=> refetch()
  const handleResetFilter = async ()=> {
    await new Promise(resolve=>resolve(setFilters(initialFilters)))
    refetch()
  }

  const {
    financeiro: {
      contasPagar: { fetchTitulos },
    },
  } = useApi();
  const { data, error, isLoading, isError, refetch  } = useQuery({ queryKey: ["fin_cp_titulos", pagination], queryFn: () => fetchTitulos({ pagination, filters }), retry: false });

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="px-1">
            <input
              type="checkbox"
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <input
              type="checkbox"
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: "id",
        header: "ID",
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
          return (
            <div title={label} className="block truncate max-w-96">
              {label}
            </div>
          );
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
          return (
            <div title={label} className="block truncate max-w-96">
              {label}
            </div>
          );
        },
      },
      {
        header: "solicitante",
        accessorKey: "solicitante",
        cell: (info) => {
          let label = info.getValue();
          return (
            <div title={label} className="block truncate max-w-96">
              {label}
            </div>
          );
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
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
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
      {/* Ações */}
      <div className="mb-2 flex gap-3">
        <Button><FilePlus2 size={16} className="me-2"/> Nova solicitação</Button>
      </div>

      {/* Filtros */}
      <Accordion type="single" collapsible className="p-2 bg-slate-200 dark:bg-slate-950 mb-2 rounded-lg">
        <AccordionItem value="item-1">
          <AccordionTrigger className="py-1 hover:no-underline">Filtros</AccordionTrigger>
          <AccordionContent>
            <ScrollArea  className="w-fill whitespace-nowrap rounded-md border">
              <div className="flex w-max space-x-4 p-4">
              <Button onClick={handleClickFilter}>Filtrar <FilterIcon size={12} className="ms-2"/></Button>
              <Button onClick={handleResetFilter} variant='destructive'>Limpar <EraserIcon size={12} className="ms-2"/></Button>

              <Input type="number" placeholder="ID" className='w-[80px]' value={filters.id}  onChange={(e)=>{setFilters(prev=>({...prev, id: e.target.value}))}}/>
              
              <SelectGrupoEconomico showAll value={filters.id_grupo_economico} onChange={(id_grupo_economico)=>{setFilters(prev=>({...prev, id_grupo_economico: id_grupo_economico}))}}/>

              <Select value={filters.id_status}  onValueChange={(id_status)=>{setFilters(prev=>({...prev, id_status: id_status}))}}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status"  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Todos status</SelectItem>
                  <SelectItem value="1">Solicitado</SelectItem>
                  <SelectItem value="2">Negado</SelectItem>
                  <SelectItem value="3">Aprovado</SelectItem>
                  <SelectItem value="4">Pago</SelectItem>
                  <SelectItem value="5">Cancelado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.tipo_data}  onValueChange={(tipo_data)=>{setFilters(prev=>({...prev, tipo_data: tipo_data}))}}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de data"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Criação</SelectItem>
                  <SelectItem value="data_emissao">Emissão</SelectItem>
                  <SelectItem value="data_vencimento">Vencimento</SelectItem>
                  <SelectItem value="data_pagamento">Pagamento</SelectItem>
                  <SelectItem value="data_provisao">Provisão</SelectItem>
                </SelectContent>
              </Select>

              <DatePickerWithRange date={filters.range_data} setDate={(date)=>{setFilters(prev=>({...prev, range_data: date}))}} />

                <Input className='max-w-[200px]' value={filters.descricao} onChange={(e)=>setFilters(prev=>({...prev, descricao: e.target.value}))} placeholder='Descrição...'/>

              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Tabela */}
      <table className="w-auto rounded-lg">
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
