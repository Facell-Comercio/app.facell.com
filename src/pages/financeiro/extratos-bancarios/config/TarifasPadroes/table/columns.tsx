import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";
import { useStoreTableTarifas } from "./store-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowTitulo = {
  select: ReactNode;
  id: string;
  status: string;
  created_at: Date;
  data_prevista: Date;
  valor: string;
  descricao: string;
  fornecedor: string;
  solicitante: string;
};

const openModal = useStoreTableTarifas.getState().openModal;

export const columnsTable: ColumnDef<RowTitulo>[] = [
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
      <div className="flex items-center">
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
    accessorKey: "id",
    header: "ID",
    cell: (info) => (
      <div
        className="font-semibold cursor-pointer text-blue-500 rounded-lg"
        onClick={() => openModal(info.getValue<string>())}
      >
        {info.getValue<string>()}
      </div>
    ),
    size: 30,
    enableSorting: false,
  },
  {
    header: "Grupo Econômico",
    accessorKey: "grupo_economico",
  },
  {
    header: "Centro Custo",
    accessorKey: "centro_custo",
  },
  {
    header: "Plano Contas",
    accessorKey: "plano_contas",
    cell: (info) => (
      <div className="text-nowrap">{info.getValue<string>()}</div>
    ),
  },
  {
    id: "descricao",
    accessorKey: "descricao",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
    header: "Descrição",
  },
];
