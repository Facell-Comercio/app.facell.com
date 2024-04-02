"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { FileSearch2 } from "lucide-react";
import { ReactNode } from "react";
import { useStoreBanco } from "../bancos/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowFornecedor = {
  select: ReactNode;
  id: string;
  codigo_banco: string;
  nome_banco: string;
};

const openModal = useStoreBanco.getState().openModal;

export const columnsTable: ColumnDef<RowFornecedor>[] = [
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
    enableSorting: false,
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
      <FileSearch2
        className="text-blue-500"
        onClick={() => openModal(info.getValue<number>().toString())}
      />
    ),
  },
  {
    header: "CÓDIGO",
    accessorKey: "codigo_banco",
    cell: (info) => {
      const codigo_banco = info.getValue<string>();
      return <span>{codigo_banco && codigo_banco.toUpperCase()}</span>;
    },
  },
  {
    header: "NOME DO BANCO",
    accessorKey: "nome_banco",
    cell: (info) => {
      const nome_banco = info.getValue<string>();
      return <span>{nome_banco.toUpperCase()}</span>;
    },
  },
];
