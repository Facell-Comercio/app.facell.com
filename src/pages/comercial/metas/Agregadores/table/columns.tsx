import { normalizeDate, normalizePercentual } from "@/helpers/mask";
import { ColumnDef } from "@tanstack/react-table";
import { FileSearch2 } from "lucide-react";
import { ReactNode } from "react";
import { useStoreAgregador } from "../agregador/store-agregador";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowMeta = {
  select: ReactNode;
  id: string;
  ref: string;
  ciclo: string;
  grupo_economico: string;
  filial: string;
  cargo: string;
  cpf: string;
  nome: string;
  tags: string;
  data_inicial: string;
  proporcional: string;
  controle: string;
  pos: string;
  upgrade: string;
  receita: string;
  aparelho: string;
  acessorio: string;
  pitzi: string;
  fixo: string;
  wttx: string;
  live: string;
};

const openModal = useStoreAgregador.getState().openModal;

export const columnsTable: ColumnDef<RowMeta>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <div className="px-1">
  //       <Checkbox
  //         checked={
  //           table.getIsAllPageRowsSelected() ||
  //           (table.getIsSomePageRowsSelected() && "indeterminate")
  //         }
  //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       />
  //     </div>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="flex items-center">
  //       <Checkbox
  //         {...{
  //           checked: row.getIsSelected(),
  //           disabled: !row.getCanSelect(),
  //           indeterminate: row.getIsSomeSelected().toString(),
  //           onCheckedChange: row.getToggleSelectedHandler(),
  //         }}
  //       />
  //     </div>
  //   ),
  // },
  {
    accessorKey: "id",
    header: "ID",
    cell: (info) => (
      <div
        className="font-semibold cursor-pointer text-blue-500 rounded-lg"
        onClick={() => {
          openModal(info.getValue<string>());
        }}
      >
        <FileSearch2 />
      </div>
    ),
    size: 30,
    enableSorting: false,
  },
  {
    id: "ref",
    accessorKey: "ref",
    cell: (info) => {
      const label = normalizeDate(info.getValue<string>());
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
    header: "ref",
  },
  {
    id: "ciclo",
    accessorKey: "ciclo",
    cell: (info) => {
      const label = normalizeDate(info.getValue<string>());
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
    header: "ciclo",
  },
  {
    header: "Grupo econômico",
    accessorKey: "grupo_economico",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block max-w-96 uppercase">
          {label}
        </div>
      );
    },
  },
  {
    header: "Filial",
    accessorKey: "filial",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block max-w-96 truncate uppercase">
          {label}
        </div>
      );
    },
  },
  {
    header: "Cargo",
    accessorKey: "cargo",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block max-w-96 truncate uppercase">
          {label}
        </div>
      );
    },
  },
  {
    header: "CPF",
    accessorKey: "cpf",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block max-w-96 truncate uppercase">
          {label}
        </div>
      );
    },
  },
  {
    header: "Nome",
    accessorKey: "nome",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block max-w-96 truncate uppercase">
          {label}
        </div>
      );
    },
  },
  {
    header: "Tags",
    accessorKey: "tags",
  },
  {
    id: "data_inicial",
    accessorKey: "data_inicial",
    cell: (info) => {
      const label = normalizeDate(info.getValue<string>());
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
    header: "Data Inicial",
  },
  {
    id: "data_final",
    accessorKey: "data_final",
    cell: (info) => {
      const label = normalizeDate(info.getValue<string>());
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
    header: "Data Final",
  },
  {
    id: "proporcional",
    accessorKey: "proporcional",
    cell: (info) => {
      const label = normalizePercentual(info.getValue<string>());
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
    header: "Proporcional",
  },
  {
    header: "Tipo Agregação",
    accessorKey: "tipo_agregacao",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block max-w-96 truncate uppercase">
          {label}
        </div>
      );
    },
  },
];
