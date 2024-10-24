import { normalizeCurrency } from "@/helpers/mask";
import { ColumnDef } from "@tanstack/react-table";
import { FileSearch } from "lucide-react";
import { ReactNode } from "react";
import { useStoreTesouraria } from "../store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowConferenciaCaixa = {
  select: ReactNode;
  id: string;
  data: string;
  status: string;
  divergencia: string;
  ocorrencias: string;
  id_filial: string;
};

const openModal = useStoreTesouraria.getState().openModal;

export const columnsTable: ColumnDef<RowConferenciaCaixa>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (info) => {
      const id = info.getValue<string>();
      return (
        <div
          className="font-semibold cursor-pointer text-blue-500 rounded-lg"
          onClick={() => {
            openModal(id);
          }}
        >
          <FileSearch />
        </div>
      );
    },
    size: 30,
    enableSorting: false,
  },

  {
    header: "Conta",
    accessorKey: "conta",
    cell: (info) => {
      const label = info.getValue<string>();
      return <span className="uppercase">{label}</span>;
    },
  },
  {
    header: "Saldo",
    accessorKey: "saldo",
    cell: (info) => {
      const label = info.getValue<number>();
      return <span>{normalizeCurrency(label)}</span>;
    },
  },
];
