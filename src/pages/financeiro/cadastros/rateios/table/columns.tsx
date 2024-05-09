

import { ColumnDef } from "@tanstack/react-table";
import { FileSearch2 } from "lucide-react";
import { useStoreRateios } from "../rateio/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowPlanoConta = {
  id: string;
  nome: string;
  codigo: string;
  grupo_economico: string;
  ativo: string;
};

const openModal = useStoreRateios.getState().openModal;

export const columnsTable: ColumnDef<RowPlanoConta>[] = [
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
    header: "NOME",
    accessorKey: "nome",
    cell: (info) => {
      const nome = info.getValue<string>();
      return <span>{nome}</span>;
    },
  },
  {
    header: "GRUPO ECONÔMICO",
    accessorKey: "grupo_economico",
    cell: (info) => {
      const grupo_economico = info.getValue<string>();
      return <span>{grupo_economico}</span>;
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
