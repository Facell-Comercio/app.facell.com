import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
  Banknote,
  CreditCard,
  FileSearch2,
  Landmark,
} from "lucide-react";
import { useStoreBordero } from "../../borderos/bordero/store";
import { useStoreCartao } from "../../cartoes/cartao/store";
import { useStoreTitulo } from "../../titulos/titulo/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowVencimento = {
  id_bordero: string;
  id_titulo: string;
  id_vencimento: string;
  data_vencimento: Date;
  valor: string;
  data_pagamento: Date;
  tipo_baixa: string;
  valor_pago: string;
  num_doc: string;
  nome_fornecedor: string;
  filial: string;
  descricao: string;
  tipo: "vencimento" | "fatura";
};
const openModal =
  useStoreBordero.getState().openModal;
const openModalTitulo =
  useStoreTitulo.getState().openModal;
const openModalFatura =
  useStoreCartao.getState().openModalFatura;

export const columnsTablePagos: ColumnDef<RowVencimento>[] =
  [
    {
      id: "id_forma_pagamento",
      header: "forma",
      accessorKey: "id_forma_pagamento",
      cell: (info) => {
        const id_forma_pagamento = parseInt(
          info.getValue<string>()
        );
        if (id_forma_pagamento === 3) {
          return (
            <Button
              className="w-full py-1 max-h-8 text-xs text-center border-none bg-green-600 hover:bg-green-600/90 dark:bg-green-700 dark:hover:bg-green-700/90"
              size={"xs"}
              onClick={() =>
                openModalTitulo({
                  id: info.row.original.id_titulo,
                })
              }
            >
              <Banknote size={16} />
            </Button>
          );
        } else if (id_forma_pagamento === 6) {
          return (
            <Button
              className="w-full py-1 max-h-8 text-xs text-center border-none bg-violet-600 hover:bg-violet-600/90 dark:bg-violet-700 dark:hover:bg-violet-600/90"
              size={"xs"}
              onClick={() =>
                openModalFatura(
                  info.row.original.id_vencimento
                )
              }
            >
              <CreditCard size={16} />
            </Button>
          );
        } else {
          return (
            <Button
              className="w-full py-1.5 max-h-8 text-xs text-center border-none bg-zinc-600 hover:bg-zinc-600/90 dark:bg-zinc-700 dark:hover:bg-zinc-700/90"
              size={"xs"}
              onClick={() =>
                openModalTitulo({
                  id: info.row.original.id_titulo,
                })
              }
            >
              <Landmark size={16} />
            </Button>
          );
        }
      },
      enableSorting: false,
    },
    {
      id: "id_bordero",
      header: "BORDERÔ",
      accessorKey: "id_bordero",
      cell: (info) => {
        return (
          <span
            title="Ver Borderô"
            className="flex items-center justify-center w-full"
          >
            <FileSearch2
              className="text-blue-500 cursor-pointer"
              onClick={() =>
                openModal(
                  info
                    .getValue<number>()
                    .toString()
                )
              }
            />
          </span>
        );
      },
      enableSorting: false,
    },
    {
      id: "id_titulo",
      header: "ID TÍTULO",
      accessorKey: "id_titulo",
      cell: (info) => {
        const label =
          info.row.original.tipo === "vencimento"
            ? info.getValue<string>()
            : "-";
        return (
          <span
            title={label}
            className="flex font-semibold truncate max-w-96"
          >
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
        const data = new Date(
          info.getValue<Date>()
        ).toLocaleString("pt-BR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        return (
          <span
            title={data}
            className="block truncate max-w-96"
          >
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
          <span
            title={label}
            className="block text-right text-nowrap"
          >
            R${" "}
            {parseFloat(label).toLocaleString(
              "pt-BR",
              {
                useGrouping: true,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </span>
        );
      },
    },
    {
      id: "valor_pago",
      header: "VALOR PAGO",
      accessorKey: "valor_pago",
      cell: (info) => {
        const label = info.getValue<string>();
        return (
          <span
            title={label}
            className="block text-right text-nowrap"
          >
            R${" "}
            {parseFloat(label).toLocaleString(
              "pt-BR",
              {
                useGrouping: true,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </span>
        );
      },
    },
    {
      id: "data_pagamento",
      header: "PAGAMENTO",
      accessorKey: "data_pagamento",
      cell: (info) => {
        const data = new Date(
          info.getValue<Date>()
        ).toLocaleString("pt-BR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        return (
          <span
            title={data}
            className="block truncate max-w-96"
          >
            {data}
          </span>
        );
      },
    },
    {
      id: "tipo_baixa",
      header: "TIPO BAIXA",
      accessorKey: "tipo_baixa",
      cell: (info) => {
        const label = info.getValue<string>();
        return <div title={label}>{label}</div>;
      },
      enableSorting: false,
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
      id: "nome_fornecedor",
      header: "FORNECEDOR",
      accessorKey: "nome_fornecedor",
      cell: (info) => {
        const label = info.getValue<string>();
        return (
          <div
            title={label}
            className="block truncate max-w-96 uppercase"
          >
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
          <div
            title={label}
            className="block truncate max-w-96 uppercase"
          >
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
          <div
            title={label}
            className="block truncate max-w-96 uppercase"
          >
            {label}
          </div>
        );
      },
    },
  ];
