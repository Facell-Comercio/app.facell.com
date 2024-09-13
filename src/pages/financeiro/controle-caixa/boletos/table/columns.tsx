import { Badge } from "@/components/ui/badge";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { ColumnDef } from "@tanstack/react-table";
import { FileSearch } from "lucide-react";
import { ReactNode } from "react";
import { useStoreBoleto } from "../boleto/store";

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

export function BadgeBoletoStatus({ status }: { status?: string }) {
  if (status === "aguardando_emissao") {
    return (
      <Badge variant={"warning"} className="uppercase">
        Aguardando Emissão
      </Badge>
    );
  } else if (status === "pago") {
    return (
      <Badge variant={"default"} className="uppercase">
        Pago
      </Badge>
    );
  } else if (status === "em_pagamento") {
    return (
      <Badge variant={"violet"} className="uppercase">
        Em Pagamento
      </Badge>
    );
  } else if (status === "emitido") {
    return (
      <Badge className="uppercase" variant={"success"}>
        Emitido
      </Badge>
    );
  } else if (status === "cancelado") {
    return (
      <Badge variant={"secondary"} className="uppercase">
        Cancelado
      </Badge>
    );
  } else if (status === "atrasado") {
    return (
      <Badge variant={"destructive"} className="uppercase">
        Atrasado
      </Badge>
    );
  } else {
    undefined;
  }
}
const openModal = useStoreBoleto.getState().openModal;

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
    id: "data",
    accessorKey: "data",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={normalizeDate(label)} className="block truncate max-w-96 uppercase">
          {normalizeDate(label)}
        </div>
      );
    },
    header: "Data",
  },
  {
    header: "STATUS",
    accessorKey: "status",
    cell: (info) => {
      const label = info.getValue<string>();
      return <BadgeBoletoStatus status={label} />;
    },
  },
  {
    header: "Filial",
    accessorKey: "filial",
  },
  {
    header: "Valor",
    accessorKey: "valor",
    cell: (info) => {
      const label = info.getValue<number>();
      return <span>{normalizeCurrency(label)}</span>;
    },
  },
  {
    header: "Emissão",
    accessorKey: "data_emissao",
    cell: (info) => {
      const label = info.getValue<Date | string>();
      return <span>{label ? normalizeDate(label) : "-"}</span>;
    },
  },
  {
    header: "Vencimento",
    accessorKey: "data_vencimento",
    cell: (info) => {
      const label = info.getValue<Date | string>();
      return <span>{label ? normalizeDate(label) : "-"}</span>;
    },
  },
];
