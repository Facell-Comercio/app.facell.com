import { ColumnDef } from "@tanstack/react-table";
import { FileSearch2 } from "lucide-react";
import { ReactNode } from "react";
import { useStoreCentroCustos } from "../centro-custo/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowCentroCustos = {
  select: ReactNode;
  id: string;
  nome: string;
  grupo_economico: string;
  ativo: string;
};

const openModal = useStoreCentroCustos.getState().openModal;

export const columnsTable: ColumnDef<RowCentroCustos>[] = [
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
    header: "NOME",
    accessorKey: "nome",
    cell: (info) => {
      const nome = info.getValue<string>();
      return <span>{nome.toUpperCase()}</span>;
    },
  },
  {
    header: "GRUPO ECONÔMICO",
    accessorKey: "grupo_economico",
    cell: (info) => {
      const grupo_economico = info.getValue<string>();
      return <span>{grupo_economico && grupo_economico.toUpperCase()}</span>;
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
