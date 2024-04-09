"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { FileSearch2 } from "lucide-react";
import { ReactNode } from "react";
import { useStoreCadastro } from "../cadastro/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowCadastro = {
  select: ReactNode;
  id: string;
  cnpj: string;
  nome: string;
  razao: string;
  ativo: string;
};

const openModal = useStoreCadastro.getState().openModal;

export const columnsTable: ColumnDef<RowCadastro>[] = [
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
        className="text-blue-500 cursor-pointer"
        onClick={() => openModal(info.getValue<number>().toString())}
      />
    ),
    sortDescFirst: true,
  },
  {
    header: "MÊS/ANO",
    accessorKey: "ref",
    cell: (info) => {
      const ref = info.getValue<string>();
      const partesData = ref?.split("-") || "2024-04-01".split("-");
      console.log(partesData);

      const mes = partesData[1];
      const ano = partesData[0];

      return (
        <span>
          {mes}/{ano}
        </span>
      );
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
