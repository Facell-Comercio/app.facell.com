import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { useStoreTitulo } from "../../titulos/titulo/store";

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

const openModal = useStoreTitulo.getState().openModal;

export const columnsTableSemNota: ColumnDef<RowTitulo>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (info) => (
      <span
        className="flex justify-center font-semibold cursor-pointer text-blue-500"
        onClick={() => openModal(info.getValue<string>())}
      >
        {info.getValue<string>()}
      </span>
    ),
    enableSorting: false,
  },
  {
    header: "DATA Solicitação",
    accessorKey: "data_solicitacao",
    cell: (info) => {
      const data = info.getValue<Date>();
      return (
        <span className="w-full flex justify-center">
          {formatDate(data, "dd/MM/yyyy HH:mm")}
        </span>
      );
    },
  },

  {
    header: "Valor",
    accessorKey: "valor",
    cell: (info) => (
      <span className="block text-right text-nowrap">
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
    accessorKey: "nome_fornecedor",
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
];

export const columnsTableNegadas: ColumnDef<RowTitulo>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (info) => (
      <span
        className="flex justify-center font-semibold cursor-pointer text-blue-500"
        onClick={() => openModal(info.getValue<string>())}
      >
        {info.getValue<string>()}
      </span>
    ),
    enableSorting: false,
  },
  {
    header: "DATA Solicitação",
    accessorKey: "data_solicitacao",
    cell: (info) => {
      const data = info.getValue<Date>();
      return (
        <span className="w-full flex justify-center">
          {formatDate(data, "dd/MM/yyyy HH:mm")}
        </span>
      );
    },
  },

  {
    header: "Valor",
    accessorKey: "valor",
    cell: (info) => (
      <span className="block text-right text-nowrap">
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
    accessorKey: "nome_fornecedor",
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
];

export const columnsTableRecorrencias: ColumnDef<RowRecorrencia>[] = [
  {
    id: "id",
    accessorKey: "id_titulo",
    header: "ID TÍTULO",
    cell: (info) => (
      <span
        className="font-semibold cursor-pointer text-blue-500 text-center"
        onClick={() => {
          const id_titulo = info.getValue<string>();
          const id = info.cell.row.original.id;
          const data_vencimento = info.cell.row.original.data_vencimento;
          const valor = info.cell.row.original.valor;
          openModal(id_titulo, {
            data_vencimento,
            id,
            valor,
          });
        }}
      >
        {info.getValue<string>()}
      </span>
    ),
    enableSorting: false,
  },
  {
    header: "DATA VENCIMENTO",
    accessorKey: "data_vencimento",
    cell: (info) => {
      const data = info.getValue<Date>();
      return new Date(data).toLocaleString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
  },
  {
    header: "VALOR",
    accessorKey: "valor",
    cell: (info) => (
      <span className="block text-right text-nowrap">
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
    header: "FORNECEDOR",
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
    id: "filial",
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
    header: "DESCRIÇÃO",
    accessorKey: "descricao",
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
