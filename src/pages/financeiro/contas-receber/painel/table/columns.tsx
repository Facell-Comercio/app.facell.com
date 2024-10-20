import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { useStoreTituloReceber } from "../../titulos/titulo/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowTitulo = {
  id: string;
  data_solicitacao: Date;
  valor: string;
  fornecedor: string;
  filial: string;
  descricao: string;
};

export type RowRecorrencia = {
  id: string;
  data_vencimento: Date;
  valor: string;
  fornecedor: string;
  filial: string;
  descricao: string;
};

const openModal = useStoreTituloReceber.getState().openModal;

export const columnsTableCanceladas: ColumnDef<RowTitulo>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (info) => (
      <span
        className="flex justify-center font-semibold cursor-pointer text-blue-500"
        onClick={() => openModal({ id: info.getValue<string>() })}
      >
        {info.getValue<string>()}
      </span>
    ),
    enableSorting: false,
  },
  {
    header: "DATA Criação",
    accessorKey: "created_at",
    cell: (info) => {
      const data = info.getValue<Date>();
      return (
        <span className="w-full flex justify-center">{formatDate(data, "dd/MM/yyyy HH:mm")}</span>
      );
    },
  },

  {
    header: "Valor",
    accessorKey: "valor",
    cell: (info) => (
      <span className="block text-nowrap">
        R${" "}
        {parseFloat(info.getValue<string>()).toLocaleString("pt-BR", {
          useGrouping: true,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  },
  {
    header: "Fornecedor",
    accessorKey: "fornecedor",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block truncate max-w-96">
          {label}
        </div>
      );
    },
  },
  {
    header: "FILIAL",
    accessorKey: "filial",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block truncate max-w-96">
          {label}
        </div>
      );
    },
  },
  {
    id: "descricao",
    accessorKey: "descricao",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block truncate max-w-96">
          {label}
        </div>
      );
    },
    header: "Descrição",
  },
  {
    header: "CRIADOR",
    accessorKey: "criador",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block truncate max-w-96">
          {label}
        </div>
      );
    },
  },
];
