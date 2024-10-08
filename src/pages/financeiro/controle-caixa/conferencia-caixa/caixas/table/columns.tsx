import { Badge } from "@/components/ui/badge";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { ColumnDef } from "@tanstack/react-table";
import { FileSearch } from "lucide-react";
import { ReactNode } from "react";
import { useStoreCaixa } from "../caixa/store";

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

export function badgeVariantCaixaClass(status?: string) {
  if (status === "A CONFERIR") {
    return "bg-secondary hover:bg-secondary hover:opacity-90 text-foreground";
  } else if (status === "CONFERIDO") {
    return "bg-success hover:bg-success hover:opacity-90 text-white";
  } else if (status === "CONFIRMADO") {
    return "bg-primary hover:bg-primary hover:opacity-90 text-white";
  } else {
    return "";
  }
}
const openModal = useStoreCaixa.getState().openModal;

export const columnsTable: ColumnDef<RowConferenciaCaixa>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (info) => {
      const id = info.getValue<string>();
      const data_caixa = info.row.original.data;
      const id_filial = info.row.original.id_filial;
      return (
        <div
          className="font-semibold cursor-pointer text-blue-500 rounded-lg"
          onClick={() => {
            openModal({ id, data_caixa, id_filial });
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
        <div
          // @ts-ignore
          title={normalizeDate(label)}
          className="block truncate max-w-96 uppercase">
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
      return (
        <Badge
          className={`text-nowrap text-foreground cursor-default ${badgeVariantCaixaClass(label)}`}
        >
          {label}
        </Badge>
      );
    },
  },
  {
    header: "Divergência",
    accessorKey: "divergente",
    cell: (info) => {
      const label = info.getValue<number>();
      return (
        <span className={`${label ? "text-red-500" : "text-green-500"}`}>
          {label ? "SIM" : "NÃO"}
        </span>
      );
    },
  },
  {
    header: "Ocorrências",
    accessorKey: "ocorrencias",
  },
  {
    header: "BAIXAR MANUAL",
    accessorKey: "manual",
    cell: (info) => {
      const val = info.getValue();
      return val ? <span className="text-red-500">SIM</span> : "NÃO";
    },
  },
  {
    header: "Saldo Caixa",
    accessorKey: "saldo",
    cell: (info) => {
      const label = info.getValue<number>();
      return <span>{normalizeCurrency(label)}</span>;
    },
  },
];
