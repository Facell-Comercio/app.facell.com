"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { FileSearch2 } from "lucide-react";
import { ReactNode } from "react";
import { useStorePlanoContas } from "../plano-conta/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowPlanoConta = {
  select: ReactNode;
  id: string;
  codigo: string;
  descricao: string;
  tipo: string;
  grupo_economico: string;
  ativo: string;
};

const openModal = useStorePlanoContas.getState().openModal;

export const columnsTable: ColumnDef<RowPlanoConta>[] = [
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
    header: "CÓDIGO",
    accessorKey: "codigo",
    cell: (info) => {
      const codigo = info.getValue<string>();
      return <span>{codigo}</span>;
    },
  },
  {
    header: "DESCRIÇÃO",
    accessorKey: "descricao",
    cell: (info) => {
      const descricao = info.getValue<string>();
      return <span>{descricao.toUpperCase()}</span>;
    },
  },
  {
    header: "TIPO",
    accessorKey: "tipo",
    cell: (info) => {
      const tipo = info.getValue<string>();
      let color = "";
      if (tipo === "Receita") {
        color = "text-green-500";
      } else if (tipo === "Despesa") {
        color = "text-red-500";
      }
      return <span className={`${color}`}>{tipo}</span>;
    },
  },
  {
    header: "GRUPO ECONÔMICO",
    accessorKey: "grupo_economico",
    cell: (info) => {
      const grupo_economico = info.getValue<string>();
      return <span>{grupo_economico.toUpperCase()}</span>;
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
