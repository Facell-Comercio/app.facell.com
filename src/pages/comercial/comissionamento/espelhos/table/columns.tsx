import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { FileSearch2 } from "lucide-react";
import { useStoreEspelho } from "../espelho/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowEspelho = {
  acoes: string;
  att: string;
  id: string;
  ref: string;
  filial: string;
  cargo: string;
  nome: string;
  comissao: string;
  bonus: string;
};

const openModal = useStoreEspelho.getState().openModal;

export const columnsTable: ColumnDef<RowEspelho>[] = [
  {
    accessorKey: "acoes",
    header: "AÇÕES",
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
    id: "att",
    accessorKey: "att",
    cell: (info) => {
      const label = formatDate(info.getValue<string>(), "dd/MM/yyyy HH:mm");
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
    header: "att",
  },
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    id: "ref",
    accessorKey: "ref",
    cell: (info) => {
      const label = normalizeDate(info.getValue<string>());
      return (
        <div title={label || ""} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
    header: "ref",
  },

  {
    header: "Filial",
    accessorKey: "filial",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label || ""} className="block max-w-96 truncate uppercase">
          {label || ""}
        </div>
      );
    },
  },
  {
    header: "Cargo",
    accessorKey: "cargo",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block max-w-96 truncate uppercase">
          {label}
        </div>
      );
    },
  },

  {
    header: "Nome",
    accessorKey: "nome",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block max-w-96 truncate uppercase">
          {label}
        </div>
      );
    },
  },
  {
    id: "comissao",
    accessorKey: "comissao",
    cell: (info) => {
      const label = normalizeCurrency(info.getValue<string>());
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
    header: "Comissão",
  },
  {
    id: "bonus",
    accessorKey: "bonus",
    cell: (info) => {
      const label = normalizeCurrency(info.getValue<string>());
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
    header: "Bônus",
  },
];
