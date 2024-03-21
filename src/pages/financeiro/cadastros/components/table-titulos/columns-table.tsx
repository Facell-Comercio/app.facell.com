"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { ReactNode } from "react"
import { useStoreFornecedor } from "../titulo/store-fornecedor"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowTitulo = {
  select: ReactNode
  id: string
  status: "Solicitado" | "Negado" | "Aprovado" | "Pago" | "Cancelado"
  created_at: Date
  data_vencimento: Date
  valor: number
  descricao: string
  fornecedor: string
  solicitante: string
}

const setModalFornecedorIsOpen = useStoreFornecedor.getState().setModalFornecedorIsOpen

export const columnsTableTitulos: ColumnDef<RowTitulo>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="px-1">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}

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
            indeterminate: row.getIsSomeSelected().toString(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: (info) => (
      <span className='font-semibold cursor-pointer text-blue-500' onClick={() => setModalFornecedorIsOpen({ open: true, id_titulo: info.getValue<number>().toString() })}>{info.getValue<number>()}</span>
    ),
    sortDescFirst: true,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (info) => {
      const status = info.getValue<string>();
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
      const data = info.getValue<Date>();
      return new Date(data).toLocaleString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit" });
    },
  },
  {
    header: "vencimento",
    accessorKey: "data_vencimento",
    cell: (info) => {
      const data = info.getValue<Date>();
      return new Date(data).toLocaleString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit" });
    },
  },
  {
    header: "Valor",
    accessorKey: "valor",
    cell: (info) => <span className="block text-right">{parseFloat(info.getValue<string>()).toLocaleString("pt-BR", { useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>,
  },
  {
    accessorFn: (row) => row.descricao,
    id: "descricao",
    accessorKey: "descricao",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block truncate max-w-96">
          {label}
        </div>
      );
    },
    header: "Descrição",
  },
  {
    header: "Fornecedor",
    accessorKey: "fornecedor",
    cell: (info) => {
      const label = info.getValue<string>();
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
      const label = info.getValue<string>();
      return (
        <div title={label} className="block truncate max-w-96">
          {label}
        </div>
      );
    },
  },
]
