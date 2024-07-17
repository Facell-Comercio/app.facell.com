import { FaturaSchema } from "@/hooks/financeiro/useCartoes";
import { ColumnDef } from "@tanstack/react-table";
import { FileSearch2 } from "lucide-react";
import { useStoreCartao } from "./store";

const openModal = useStoreCartao.getState().openModalFatura;

export const columnsTableFaturas: ColumnDef<FaturaSchema>[] = [
  {
    id: "id",
    header: "Fatura",
    accessorKey: "id",
    cell: (info) => {
      return (
        <p
          className="text-blue-500 cursor-pointer"
          onClick={() => openModal(info.getValue<number>().toString())}
        >
          <FileSearch2 />
        </p>
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
        <span title={label} className="block text-nowrap">
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
    id: "status",
    accessorKey: "status",
    header: "STATUS",
    cell: (info) => {
      const label = info.getValue<string>();
      let color = "";
      if (label === "pendente") {
        color = "text-yellow-600";
      } else if (label === "pago") {
        color = "text-green-600";
      } else if (label === "programado") {
        color = "text-orange-600";
      } else {
        color = "text-red-500";
      }
      return (
        <div className={`block capitalize truncate max-w-96 ${color}`}>
          {label}
        </div>
      );
    },
  },
  {
    id: "closed",
    accessorKey: "closed",
    header: "Fechada",
    cell: (info) => {
      const label = info.getValue<string>();

      return (
        <div
          className={`block uppercase truncate max-w-96 ${
            label ? "text-green-500" : "text-red-500"
          }`}
        >
          {label ? "SIM" : "NÃO"}
        </div>
      );
    },
  },
];
