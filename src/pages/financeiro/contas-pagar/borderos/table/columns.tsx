import { Badge } from "@/components/ui/badge";
import {
  normalizeCurrency,
  normalizeDate,
} from "@/helpers/mask";
import { ColumnDef } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { ReactNode } from "react";
import { useStoreBordero } from "../bordero/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowBordero = {
  select: ReactNode;
  id: string;
  data_pagamento: string;
  conta_bancaria: string;
  qtde_total: number;
  qtde_pago: number;
  qtde_programado: number;
  qtde_erro: number;
  qtde_pendente: number;
};

const openModal =
  useStoreBordero.getState().openModal;

export const columnsTable: ColumnDef<RowBordero>[] =
  [
    {
      accessorKey: "id",
      header: "ID",
      cell: (info) => (
        <div
          className="font-semibold cursor-pointer text-blue-500 rounded-lg"
          onClick={() =>
            openModal(info.getValue<string>())
          }
        >
          {info.getValue<string>()}
        </div>
      ),
      size: 30,
      enableSorting: false,
    },
    {
      header: "STATUS",
      id: "andamento",
      cell: (info) => {
        const id_bordero = info.row.original.id;
        const qtde_total =
          info.row.original.qtde_total;
        const qtde_pendente =
          info.row.original.qtde_pendente;
        const qtde_erro =
          info.row.original.qtde_erro;
        const qtde_programado =
          info.row.original.qtde_programado;
        const qtde_pago =
          info.row.original.qtde_pago;
        const borderoConcluido =
          qtde_pago == qtde_total;

        return (
          <div
            onClick={() => {
              openModal(id_bordero);
            }}
            className="max-w-40 cursor-pointer flex justify-center gap-1"
          >
            {borderoConcluido ? (
              <Badge
                variant={"default"}
                className="w-full flex justify-center"
              >
                <Check size={18} />
              </Badge>
            ) : (
              <>
                <Badge variant={"secondary"}>
                  {qtde_pendente}
                </Badge>
                <Badge variant={"destructive"}>
                  {qtde_erro}
                </Badge>
                <Badge variant={"success"}>
                  {qtde_programado}
                </Badge>
                <Badge variant={"default"}>
                  {qtde_pago}
                </Badge>
              </>
            )}
          </div>
        );
      },
    },
    {
      header: "DATA PAGAMENTO",
      accessorKey: "data_pagamento",
      cell: (info) => {
        const data_pagamento =
          info.getValue<string>();
        return (
          <span>
            {data_pagamento &&
              normalizeDate(data_pagamento)}
          </span>
        );
      },
    },
    {
      header: "CONTA BANCÁRIA",
      accessorKey: "conta_bancaria",
      cell: (info) => {
        const conta_bancaria =
          info.getValue<string>();
        return <span>{conta_bancaria}</span>;
      },
    },
    {
      header: "QUANTIDADE",
      accessorKey: "qtde_total",
      cell: (info) => {
        const qtde_titulos =
          info.getValue<string>();
        return <span>{qtde_titulos}</span>;
      },
    },
    {
      header: "VALOR TOTAL",
      accessorKey: "valor_total",
      cell: (info) => {
        const valor_total =
          info.getValue<string>() || 0;
        return (
          <span>
            {normalizeCurrency(valor_total)}
          </span>
        );
      },
    },
  ];
