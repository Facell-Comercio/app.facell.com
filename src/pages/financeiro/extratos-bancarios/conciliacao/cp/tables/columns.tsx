import { normalizeCurrency, normalizeFirstAndLastName } from "@/helpers/mask";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { FileSearch2 } from "lucide-react";
import { ReactNode } from "react";
import { useStoreConciliacaoCP } from "../components/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowConciliacaoCP = {
  select: ReactNode;
  id: string;
  descricao: string;
  banco: string;
  tipo: string;
  grupo_economico: string;
  filial: string;
};
const openModal = useStoreConciliacaoCP.getState().openModal;

export const columnsTable: ColumnDef<RowConciliacaoCP>[] = [
  {
    header: "AÇÃO",
    accessorKey: "id",
    cell: (info) => (
      <div title="Ver conciliação" className="flex items-center justify-center">
        <FileSearch2
          size={20}
          className="text-blue-500 cursor-pointer"
          onClick={() => {
            openModal(info.getValue<number>().toString());
          }}
        />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "data_conciliacao",
    header: "CONCILIAÇÃO",
    cell: (info) => {
      let value = formatDate(
        new Date(info.getValue<Date | string>()),
        "dd/MM/yyyy"
      );
      return <div className="w-full">{value}</div>;
    },
  },
  {
    accessorKey: "tipo",
    header: "TIPO",
    size: 100,
    cell: (info) => {
      let value = info.getValue<number>();
      return <div className="w-full">{value}</div>;
    },
  },
  {
    accessorKey: "valor_transacoes",
    header: "VALOR TRANSAÇÕES",
    cell: (info) => {
      const valor = normalizeCurrency(info.getValue<string>());

      return <span>{valor}</span>;
    },
    size: 150,
  },
  {
    accessorKey: "valor_pagamentos",
    header: "VALOR PAGAMENTOS",
    cell: (info) => {
      const valor = normalizeCurrency(info.getValue<string>());

      return <span>{valor}</span>;
    },
  },

  {
    accessorKey: "responsavel",
    header: "RESPONSÁVEL",
    cell: (info) => {
      const valor = normalizeFirstAndLastName(
        info.getValue<string>().toUpperCase() || ""
      );
      return <div>{valor}</div>;
    },
  },
];
