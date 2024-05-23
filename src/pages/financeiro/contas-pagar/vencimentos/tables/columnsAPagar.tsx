import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowTitulo = {
  select: ReactNode;
  id_titulo: string;
  data_vencimento: Date;
  data_prevista: Date;
  valor: string;
  num_doc: string;
  fornecedor: string;
  filial: string;
  descricao: string;
};

export const columnsTableAPagar: ColumnDef<RowTitulo>[] = [
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
    id: "id_titulo",
    header: "ID TÍTULO",
    accessorKey: "id_titulo",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <span title={label} className="block truncate max-w-96">
          {label}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    id: "data_vencimento",
    header: "VENCIMENTO",
    accessorKey: "data_vencimento",
    cell: (info) => {
      const data = new Date(info.getValue<Date>()).toLocaleString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      return (
        <span title={data} className="block truncate max-w-96">
          {data}
        </span>
      );
    },
  },
  {
    id: "previsao",
    header: "PREVISÃO",
    accessorKey: "data_prevista",
    cell: (info) => {
      const data = new Date(info.getValue<Date>()).toLocaleString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      return (
        <span title={data} className="block truncate max-w-96">
          {data}
        </span>
      );
    },
  },
  {
    id: "valor",
    header: "VALOR",
    accessorKey: "valor",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <span title={label} className="block text-right text-nowrap">
          R${" "}
          {parseFloat(label).toLocaleString("pt-BR", {
            useGrouping: true,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      );
    },
  },
  {
    id: "num_doc",
    header: "DOC",
    accessorKey: "num_doc",
    cell: (info) => {
      const label = info.getValue<string>();
      return <div title={label}>{label}</div>;
    },
    enableSorting: false,
  },
  {
    id: "fornecedor",
    header: "FORNECEDOR",
    accessorKey: "fornecedor",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
  },
  {
    id: "filial",
    accessorKey: "filial",
    header: "FILIAL",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
  },
  {
    id: "descricao",
    accessorKey: "descricao",
    header: "DESCRIÇÃO",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
  },
];
