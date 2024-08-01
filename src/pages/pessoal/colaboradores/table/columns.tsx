import { normalizeCnpjNumber } from "@/helpers/mask";
import { ColumnDef } from "@tanstack/react-table";
import { FileSearch2 } from "lucide-react";
import { ReactNode } from "react";
import { useStoreColaborador } from "../colaborador/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowFornecedor = {
  select: ReactNode;
  id: string;
  nome: string;
  cpf: string;
};

const openModal = useStoreColaborador.getState().openModal;

export const columnsTable: ColumnDef<RowFornecedor>[] = [
  {
    header: "ID",
    accessorKey: "id",
    cell: (info) => (
      <FileSearch2
        className="text-blue-500 cursor-pointer"
        onClick={() => openModal(info.getValue<number>().toString())}
      />
    ),
  },
  {
    header: "NOME",
    accessorKey: "nome",
    cell: (info) => {
      const nome = info.getValue<string>();
      return <span className="uppercase">{nome}</span>;
    },
  },
  {
    header: "CPF",
    accessorKey: "cpf",
    cell: (info) => {
      const cpf = info.getValue<string>();
      return <span className="uppercase">{normalizeCnpjNumber(cpf)}</span>;
    },
  },
];
