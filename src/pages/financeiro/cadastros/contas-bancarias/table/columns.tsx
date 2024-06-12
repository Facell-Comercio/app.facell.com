import { ColumnDef } from "@tanstack/react-table";
import { FileSearch2 } from "lucide-react";
import { ReactNode } from "react";
import { useStoreContaBancaria } from "../conta-bancaria/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowPlanoConta = {
  select: ReactNode;
  id: string;
  descricao: string;
  filial: string;
  grupo_economico: string;
  banco: string;
  tipo_conta: string;
  active: string;
};

const openModal = useStoreContaBancaria.getState().openModal;

export const columnsTable: ColumnDef<RowPlanoConta>[] = [
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
    header: "DESCRIÇÃO",
    accessorKey: "descricao",
    cell: (info) => {
      const descricao = info.getValue<string>();
      return <span>{descricao?.toUpperCase()}</span>;
    },
  },
  {
    header: "FILIAL",
    accessorKey: "filial",
    cell: (info) => {
      const filial = info.getValue<string>();
      return <span>{filial}</span>;
    },
  },
  {
    header: "GRUPO ECONÔMICO",
    accessorKey: "grupo_economico",
    cell: (info) => {
      const grupo_economico = info.getValue<string>();
      return <span>{grupo_economico?.toUpperCase()}</span>;
    },
  },
  {
    header: "BANCO",
    accessorKey: "banco",
    cell: (info) => {
      const banco = info.getValue<string>();
      return <span>{banco?.toUpperCase()}</span>;
    },
  },
  {
    header: "STATUS",
    accessorKey: "active",
    cell: (info) => {
      const active = info.getValue();
      let color = "";
      if (active == 1) {
        color = "text-green-500";
      } else if (active == 0) {
        color = "text-red-500";
      }
      return <span className={`${color}`}>{active ? "Ativo" : "Inativo"}</span>;
    },
  },
];
