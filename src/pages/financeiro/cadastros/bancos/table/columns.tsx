import { ColumnDef } from "@tanstack/react-table";
import { FileSearch2 } from "lucide-react";
import { ReactNode } from "react";
import { useStoreBanco } from "../banco/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowFornecedor = {
  select: ReactNode;
  id: string;
  codigo: string;
  nome: string;
};

const openModal = useStoreBanco.getState().openModal;

export const columnsTable: ColumnDef<RowFornecedor>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (info) => (
      <FileSearch2
        className="text-blue-500 cursor-pointer"
        onClick={() => openModal(info.getValue<number>().toString())}
      />
    ),
  },
  {
    header: "CÓDIGO",
    accessorKey: "codigo",
    cell: (info) => {
      const codigo = info.getValue<string>();
      return <span>{codigo && codigo.toUpperCase()}</span>;
    },
  },
  {
    header: "NOME DO BANCO",
    accessorKey: "nome",
    cell: (info) => {
      const nome = info.getValue<string>();
      return <span>{nome.toUpperCase()}</span>;
    },
  },
];
