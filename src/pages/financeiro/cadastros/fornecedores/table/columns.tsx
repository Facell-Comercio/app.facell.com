"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { normalizeCnpjNumber } from "@/helpers/mask";
import { ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";
import { useStoreFornecedor } from "../fornecedor/store-fornecedor";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowFornecedor = {
  select: ReactNode;
  id: string;
  cnpj: string;
  nome: string;
  razao: string;
  ativo: string;
};

const openModal = useStoreFornecedor.getState().openModal;

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
      <span
        className="font-semibold cursor-pointer text-blue-500"
        onClick={() => openModal(info.getValue<number>().toString())}
      >
        {info.getValue<number>()}
      </span>
    ),
    sortDescFirst: true,
  },
  {
    header: "CNPJ",
    accessorKey: "cnpj",
    cell: (info) => {
      const cnpj = info.getValue<string>();
      return <span>{normalizeCnpjNumber(cnpj)}</span>;
    },
  },
  {
    header: "NOME FANTASIA",
    accessorKey: "nome",
    cell: (info) => {
      const nome = info.getValue<string>();
      return <span>{nome.toUpperCase()}</span>;
    },
  },
  {
    header: "RAZÃO SOCIAL",
    accessorKey: "razao",
    cell: (info) => {
      const razao = info.getValue<string>();
      return <span>{razao && razao.toUpperCase()}</span>;
    },
  },
  {
    header: "STATUS",
    accessorKey: "active",

    cell: (info) => {
      const active = info.getValue();
      let color = "";
      if (active == 1) {
        color = "text-green-500";
      } else if (active == 0) {
        color = "text-red-500";
      }
      return <span className={`${color}`}>{active ? "Ativo" : "Inativo"}</span>;
    },
  },
];
