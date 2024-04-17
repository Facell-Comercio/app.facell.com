"use client";

import { Checkbox } from "@/components/ui/checkbox";
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
      <div className="px-1">
        <input
          type="checkbox"
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected().toString(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    ),
  },
  {
    header: "AÇÃO",
    accessorKey: "id",
    cell: (info) => (
      <FileSearch2
        className="text-blue-500 cursor-pointer"
        onClick={() => openModal(info.getValue<number>().toString())}
      />
    ),
    enableSorting: false,
  },
  {
    header: "DATA PAGAMENTO",
    accessorKey: "data_pagamento",
    cell: (info) => {
      const data_pagamento = info.getValue<string>();
      return (
        <span>
          {data_pagamento && data_pagamento.split("T")[0].replaceAll("-", "/")}
        </span>
      );
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
];
