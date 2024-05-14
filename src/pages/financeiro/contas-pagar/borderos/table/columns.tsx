import { Checkbox } from "@/components/ui/checkbox";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { ColumnDef } from "@tanstack/react-table";
import { FileSearch2 } from "lucide-react";
import { ReactNode } from "react";
import { useStoreBordero } from "../bordero/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowBordero = {
  select: ReactNode;
  id: string;
  data_pagamento: string;
  conta_bancaria: string;
};

const openModal = useStoreBordero.getState().openModal;

export const columnsTable: ColumnDef<RowBordero>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="px-1">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      </div>
    ),
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected().toString(),
            onCheckedChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    ),
  },
  {
    header: "AÇÃO",
    accessorKey: "id",
    cell: (info) => (
      <div title="Ver Borderô">
        <FileSearch2
          className="text-blue-500 cursor-pointer"
          onClick={() => openModal(info.getValue<number>().toString())}
        />
      </div>
    ),
    enableSorting: false,
  },
  {
    header: "DATA PAGAMENTO",
    accessorKey: "data_pagamento",
    cell: (info) => {
      const data_pagamento = info.getValue<string>();
      return <span>{data_pagamento && normalizeDate(data_pagamento)}</span>;
    },
  },
  {
    header: "CONTA BANCÁRIA",
    accessorKey: "conta_bancaria",
    cell: (info) => {
      const conta_bancaria = info.getValue<string>();
      return <span>{conta_bancaria}</span>;
    },
  },
  {
    header: "QUANTIDADE",
    accessorKey: "qtde_titulos",
    cell: (info) => {
      const qtde_titulos = info.getValue<string>();
      return <span>{qtde_titulos}</span>;
    },
  },
  {
    header: "VALOR TOTAL",
    accessorKey: "valor_total",
    cell: (info) => {
      const valor_total = info.getValue<string>() || 0;
      return <span>{normalizeCurrency(valor_total)}</span>;
    },
  },
];
