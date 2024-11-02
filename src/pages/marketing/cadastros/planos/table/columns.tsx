import { ColumnDef } from "@tanstack/react-table";
import { FileSearch2 } from "lucide-react";
import { ReactNode } from "react";
import { useStorePlanoMarketing } from "../plano/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowFornecedor = {
  select: ReactNode;
  id: string;
  codigo: string;
  nome: string;
};

const openModal = useStorePlanoMarketing.getState().openModal;

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
    header: "NOME DO PLANO",
    accessorKey: "plano",
    cell: (info) => {
      const nome = info.getValue<string>();
      return <span className="uppercase">{nome.toUpperCase()}</span>;
    },
  },
  {
    header: "PRODUTO NÃO FIDELIZADO",
    accessorKey: "produto_nao_fidelizado",
    cell: (info) => {
      const label = info.getValue<string>();
      return <span className="uppercase">{label.replaceAll("_", " ")}</span>;
    },
  },
  {
    header: "PRODUTO FIDELIZADO",
    accessorKey: "produto_fidelizado",
    cell: (info) => {
      const label = info.getValue<string>();
      return <span className="uppercase">{label.replaceAll("_", " ")}</span>;
    },
  },
];
