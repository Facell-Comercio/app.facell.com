import { ColumnDef } from "@tanstack/react-table";
import { FileSearch2 } from "lucide-react";
import { ReactNode } from "react";
import { useStoreEquipamento } from "../equipamento/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowEquipamento = {
  select: ReactNode;
  id: string;
  cnpj: string;
  nome: string;
  razao: string;
  ativo: string;
};

const openModal = useStoreEquipamento.getState().openModal;

export const columnsTable: ColumnDef<RowEquipamento>[] = [
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
    header: "FILIAL",
    accessorKey: "filial",
    cell: (info) => {
      const filial = info.getValue<string>();
      return <span>{filial}</span>;
    },
  },
  {
    header: "Estabelecimento",
    accessorKey: "estabelecimento",
    cell: (info) => {
      const estabelecimento = info.getValue<string>();
      return <span>{estabelecimento}</span>;
    },
  },
  {
    header: "NÚMERO MÁQUINA",
    accessorKey: "num_maquina",
    cell: (info) => {
      const num_maquina = info.getValue<string>();
      return <span>{num_maquina}</span>;
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
