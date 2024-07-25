import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { ColumnDef } from "@tanstack/react-table";
import { FileSearch2 } from "lucide-react";
import { ReactNode } from "react";
import { useStoreVale } from "../vale/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowVale = {
  select: ReactNode;
  id: string;
  descricao: string;
  banco: string;
  tipo: string;
  grupo_economico: string;
  filial: string;
};

const openModal = useStoreVale.getState().openModal;

export const columnsTable: ColumnDef<RowVale>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (info) => (
      <div
        className="font-semibold cursor-pointer text-blue-500 rounded-lg"
        onClick={() => {
          openModal(info.getValue<string>());
        }}
      >
        <FileSearch2 />
      </div>
    ),
    size: 30,
    enableSorting: false,
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    cell: (info) => {
      const label = normalizeDate(info.getValue<string>());
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
    header: "Data",
  },
  {
    header: "Filial",
    accessorKey: "filial",
  },
  {
    header: "Nome",
    accessorKey: "nome_colaborador",
  },
  {
    header: "Origem",
    accessorKey: "origem",
  },
  {
    id: "valor",
    accessorKey: "valor",
    cell: (info) => {
      const label = normalizeCurrency(info.getValue<string>());
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
    header: "Valor",
  },
  {
    id: "saldo",
    accessorKey: "saldo",
    cell: (info) => {
      const label = normalizeCurrency(info.getValue<string>());
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
    header: "Saldo",
  },
];
