import { Button } from "@/components/ui/button";
import { normalizeDate } from "@/helpers/mask";
import { ColumnDef } from "@tanstack/react-table";
import { FileSearch } from "lucide-react";
import { useStoreCampanha } from "../campanha/store";
// import { useStoreCliente } from "../cliente/store";
// import { useStoreClientes } from "../orcamento/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowClientes = {
  id: string;
  nome: string;
  data_inicio: string | null;
  qtde_clientes: string;
  active: boolean;
};

const openModal = useStoreCampanha.getState().openModal;

// ^ Realizar a filtragem dinâmica para a apresentação do grupo econômico ++ Liberar ou não a visualização para o usuário dependendo da quantidade de centro de custos dele

export const columnsTable: ColumnDef<RowClientes>[] = [
  {
    accessorKey: "id",
    header: "AÇÃO",
    enableSorting: false,
    cell: (info) => {
      const original = info.row.original;
      return (
        <Button
          className="font-semibold cursor-pointer text-blue-500"
          disabled={parseInt(original.qtde_clientes) < 1}
          size={"xs"}
          variant={"ghost"}
          onClick={() => openModal(info.getValue<number>().toString())}
        >
          {<FileSearch />}
        </Button>
      );
    },
    sortDescFirst: true,
  },
  {
    header: "NOME",
    accessorKey: "nome",
    cell: (info) => {
      const label = info.getValue<string>();
      const { id, qtde_clientes } = info.row.original;
      return (
        <span
          className="uppercase cursor-pointer"
          onClick={() => parseInt(qtde_clientes) > 0 && openModal(id)}
        >
          {label}
        </span>
      );
    },
  },
  {
    header: "DATA INÍCIO",
    accessorKey: "data_inicio",
    cell: (info) => {
      const label = info.getValue<string>();
      return <span className="uppercase">{normalizeDate(label)}</span>;
    },
  },
  {
    header: "QUANTIDADE DE CLIENTES",
    accessorKey: "qtde_clientes",
  },
  {
    header: "ATIVO",
    accessorKey: "active",
    cell: (info) => {
      const label = info.getValue<number>();
      return (
        <span className={`uppercase ${label ? "text-green-500" : "text-red-500"}`}>
          {label ? "SIM" : "NÃO"}
        </span>
      );
    },
  },
  {
    header: "PÚBLICO",
    accessorKey: "public",
    cell: (info) => {
      const label = info.getValue<number>();
      return (
        <span className={`uppercase ${label ? "text-green-500" : "text-red-500"}`}>
          {label ? "SIM" : "NÃO"}
        </span>
      );
    },
  },
];
