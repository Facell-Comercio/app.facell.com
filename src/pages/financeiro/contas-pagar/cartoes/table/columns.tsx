import { ColumnDef } from "@tanstack/react-table";
import { CreditCard } from "lucide-react";
import { ReactNode } from "react";
import { useStoreCartao } from "../cartao/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowCartao = {
  select: ReactNode;
  id: string;
  descricao: string;
  banco: string;
  tipo: string;
  grupo_economico: string;
  filial: string;
};

const openModal = useStoreCartao.getState().openModal;

export const columnsTable: ColumnDef<RowCartao>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (info) => (
      <div
        className="font-semibold cursor-pointer text-blue-500 rounded-lg"
        onClick={() => openModal(info.getValue<string>())}
      >
        <CreditCard />
      </div>
    ),
    size: 30,
    enableSorting: false,
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
  {
    header: "Matriz",
    accessorKey: "matriz",
  },
  {
    header: "Portador",
    accessorKey: "nome_portador",
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
