import { normalizeCurrency } from "@/helpers/mask";
import { ColumnDef } from "@tanstack/react-table";
import { FileSearch2 } from "lucide-react";
import { useStoreVendaInvalidada } from "../venda-invalida/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowVendasinvalidadas = {
  id: string;
  status: string;
  tipo: string;
  segmento: string;
  valor: string;
  gsm: string;
  cpf_cliente: string;
  imei: string;
};

const openModal = useStoreVendaInvalidada.getState().openModal;

export const columnsTable: ColumnDef<RowVendasinvalidadas>[] = [
  {
    accessorKey: "id",
    header: "AÇÕES",
    cell: (info) => (
      <div
        className="font-semibold cursor-pointer text-blue-500 rounded-lg"
        onClick={() => {
          openModal(info.getValue<string>());
        }}
        title={info.getValue<string>()}
      >
        <FileSearch2 />
      </div>
    ),
    size: 30,
    enableSorting: false,
  },
  {
    header: "STATUS",
    accessorKey: "status",
    cell: (info) => {
      const label = info.getValue<string>().replaceAll("_", " ");
      let color = "";
      if (label === "PROCEDENTE") {
        color = "text-green-500";
      } else if (label === "PROCEDENTE" || label === "CIENTE") {
        color = "text-orange-500";
      }
      return (
        <div title={label} className={`block truncate max-w-96 uppercase ${color}`}>
          {label}
        </div>
      );
    },
  },
  {
    header: "TIPO",
    accessorKey: "tipo",
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
    header: "SEGMENTO",
    accessorKey: "segmento",
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
    header: "MOTIVO",
    accessorKey: "motivo",
    cell: (info) => {
      const label = info.getValue<string>();
      return (
        <div title={label} className="block uppercase">
          {label}
        </div>
      );
    },
  },
  {
    header: "VALOR",
    accessorKey: "valor",
    cell: (info) => {
      const label = normalizeCurrency(info.getValue<string>());
      return (
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
  },
  {
    header: "GSM",
    accessorKey: "gsm",
  },
  {
    header: "CPF CLIENTE",
    accessorKey: "cpf_cliente",
  },
  {
    header: "IMEI",
    accessorKey: "imei",
  },
  {
    header: "PEDIDO",
    accessorKey: "pedido",
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
