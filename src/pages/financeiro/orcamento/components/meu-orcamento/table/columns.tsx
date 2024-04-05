"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { FileSearch2 } from "lucide-react";
import { ReactNode } from "react";
import { useStoreMeuOrcamento } from "../orcamento/store";
// import { useStoreMeuOrcamento } from "../orcamento/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowMeuOrcamento = {
  select: ReactNode;
  id: string;
  centro_de_custo: string;
  nome: string;
  razao: string;
  ativo: string;
};

const openModal = useStoreMeuOrcamento.getState().openModal;

export const columnsTable: ColumnDef<RowMeuOrcamento>[] = [
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
    header: "AÇÃO",
    accessorKey: "id",
    cell: (info) => (
      <FileSearch2
        className="text-blue-500 cursor-pointer"
        onClick={() => openModal(info.getValue<number>().toString())}
      />
    ),
    enableSorting: false,
  },
  {
    header: "CENTRO DE CUSTO",
    accessorKey: "centro_custos",
    cell: (info) => {
      const id_centro_custo = info.getValue<string>();
      return <span>{id_centro_custo}</span>;
    },
  },
  {
    header: "PLANO CONTAS",
    accessorKey: "plano_contas",
    cell: (info) => {
      const id_plano_contas = info.getValue<string>();
      return <span>{id_plano_contas}</span>;
    },
  },
  {
    header: "PREVISTO",
    accessorKey: "valor_previsto",
    cell: (info) => {
      const valor_previsto = info.getValue<string>();
      return <span>{valor_previsto && valor_previsto}</span>;
    },
  },
  {
    header: "SALDO",
    accessorKey: "saldo",
    cell: (info) => {
      const saldo = info.getValue<string>();
      return <span>{saldo && saldo}</span>;
    },
  },
  {
    header: "% Realizado",
    accessorKey: "realizado_percentual",
    cell: (info) => {
      const percentual = info.getValue<number>();
      return (
        <span>{percentual && parseFloat((+percentual * 100).toFixed(2))}%</span>
      );
    },
  },
];
