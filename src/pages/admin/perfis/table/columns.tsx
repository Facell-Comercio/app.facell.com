import { ColumnDef } from "@tanstack/react-table";
import { FileSearch } from "lucide-react";
import { ReactNode } from "react";
import { useStorePerfil } from "../perfil/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowUsers = {
  select: ReactNode;
  id: string;
  img_url?: string;
  nome: string;
};

const openModal = useStorePerfil.getState().openModal;

export const columnsTable: ColumnDef<RowUsers>[] = [
  {
    accessorKey: "id",
    header: "AÇÃO",
    enableSorting: false,
    cell: (info) => (
      <span
        className="font-semibold cursor-pointer text-blue-500"
        onClick={() => openModal(info.getValue<number>().toString())}
      >
        {<FileSearch />}
      </span>
    ),
    sortDescFirst: true,
  },
  {
    header: "NOME",
    accessorKey: "perfil",
    cell: (info) => {
      const nome = info.getValue<string>();
      return <span>{nome}</span>;
    },
  },

  {
    header: "ATIVO",
    accessorKey: "active",
    cell: (info) => {
      const active = info.getValue<number>();
      return (
        <span className={`${active ? "text-green-500" : "text-red-500"}`}>
          {active ? "ATIVO" : "INATIVO"}
        </span>
      );
    },
  },
];
