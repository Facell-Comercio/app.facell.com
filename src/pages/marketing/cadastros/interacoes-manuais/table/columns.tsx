import { normalizeCnpjNumber, normalizeDate } from "@/helpers/mask";
import { ColumnDef } from "@tanstack/react-table";
import { FileSearch2 } from "lucide-react";
import { ReactNode } from "react";
import { useStoreInteracaoManual } from "../interacao/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowFornecedor = {
  select: ReactNode;
  id: string;
  codigo: string;
  nome: string;
};

const openModal = useStoreInteracaoManual.getState().openModal;

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
    header: "NOME DO CLIENTE",
    accessorKey: "nome_assinante",
    cell: (info) => {
      const nome = info.getValue<string>();
      return <span className="uppercase">{nome}</span>;
    },
  },
  {
    header: "CPF",
    accessorKey: "cpf",
    cell: (info) => {
      const nome = info.getValue<string>();
      return <span>{normalizeCnpjNumber(nome)}</span>;
    },
  },
  {
    header: "GSM",
    accessorKey: "gsm",
  },
  {
    header: "DATA",
    accessorKey: "data",
    cell: (info) => {
      const nome = info.getValue<string>();
      return <span>{normalizeDate(nome)}</span>;
    },
  },
  {
    header: "OPERADOR",
    accessorKey: "operador",
  },
  {
    header: "OBSERVAÇÃO",
    accessorKey: "observacao",
    cell: (info) => {
      const obs = info.getValue<string>();
      return <span className="uppercase">{obs}</span>;
    },
  },
];
