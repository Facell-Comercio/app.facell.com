import { Badge } from "@/components/ui/badge";
import { normalizeDate } from "@/helpers/mask";
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

export function badgeVariantCaixa(status?: string) {
  if (status === "A CONFERIR") {
    return "secondary";
  } else if (status === "CONFERIDO / BAIXA PENDENTE") {
    return "success";
  } else if (status === "BAIXADO / PENDENTE DATASYS") {
    return "default";
  } else if (status === "BAIXADO NO DATASYS") {
    return "violet";
  } else {
    undefined;
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
            console.log({ id, data_caixa, id_filial });

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
        <div title={label} className="block truncate max-w-96 uppercase">
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
      return <Badge variant={badgeVariantCaixa(label)}>{label}</Badge>;
    },
  },
  {
    header: "Divergência",
    accessorKey: "divergente",
    cell: (info) => {
      const label = info.getValue<number>();
      return (
        <span className={`${label && "text-red-500"}`}>
          {label ? "SIM" : "NÃO"}
        </span>
      );
    },
  },
  {
    header: "Ocorrências",
    accessorKey: "ocorrencias",
  },
];
