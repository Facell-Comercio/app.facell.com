import { Checkbox } from "@/components/ui/checkbox";
import { generateStatusColor } from "@/helpers/generateColorStatus";
import { ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";
import { useStoreTitulo } from "../titulo/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowTitulo = {
  select: ReactNode;
  id: string;
  status: string;
  created_at: Date;
  data_prevista: Date;
  valor: string;
  descricao: string;
  fornecedor: string;
  solicitante: string;
};

const openModal = useStoreTitulo.getState().openModal;

export const columnsTable: ColumnDef<RowTitulo>[] = [
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
      <div className="flex items-center">
        <Checkbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected().toString(),
            onCheckedChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: (info) => (
      <div
        className="font-semibold cursor-pointer text-blue-500 rounded-lg"
        onClick={() => openModal({id: info.getValue<string>()})}
      >
        {info.getValue<string>()}
      </div>
    ),
    size: 30,
    enableSorting: false,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (info) => {
      const id_titulo = info.row.original.id;

      const status = info.getValue<string>();
      const color = generateStatusColor({ status: status, text: true });
      return <span onClick={()=>openModal({id: id_titulo})} className={`${color} cursor-pointer`}>{status}</span>;
    },
  },
  {
    header: "Forma Pgto",
    accessorKey: "forma_pagamento",
  },
  {
    header: "Solicitação",
    accessorKey: "created_at",
    cell: (info) => {
      const data = info.getValue<Date>();
      return new Date(data).toLocaleString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
  },
 
  {
    header: "Fornecedor",
    accessorKey: "fornecedor",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
  },
  {
    header: "DOCUMENTO",
    accessorKey: "num_doc",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
    
  },
  {
    header: "Valor",
    accessorKey: "valor",
    cell: (info) => (
      <span className="block text-right text-nowrap">
        R${" "}
        {parseFloat(info.getValue<string>()).toLocaleString("pt-BR", {
          useGrouping: true,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  },
  {
    id: "descricao",
    accessorKey: "descricao",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
    header: "Descrição",
  },
  {
    header: "Filial",
    accessorKey: "filial",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
  },
  
  {
    header: "Solicitante",
    accessorKey: "solicitante",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
  },
];
