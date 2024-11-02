import { ColumnDef } from "@tanstack/react-table";
import { FileSearch2 } from "lucide-react";
import { ReactNode } from "react";
import { useStoreVendedor } from "../vendedor/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowFornecedor = {
  select: ReactNode;
  id: string;
  codigo: string;
  nome: string;
};

const openModal = useStoreVendedor.getState().openModal;

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
    header: "NOME DO VENDEDOR",
    accessorKey: "nome",
    cell: (info) => {
      const nome = info.getValue<string>();
      return <span>{nome.toUpperCase()}</span>;
    },
  },
  {
    header: "ATIVO",
    accessorKey: "active",
    cell: (info) => {
      const active = info.getValue<number>();
      return (
        <span className={active ? "text-green-500" : "text-red-500"}>{active ? "SIM" : "NÃO"}</span>
      );
    },
  },
];
