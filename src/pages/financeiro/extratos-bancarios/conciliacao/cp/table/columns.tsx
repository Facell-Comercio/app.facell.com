"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { ColumnDef } from "@tanstack/react-table";
import { HandCoins } from "lucide-react";
import { ReactNode } from "react";
import { useStoreConciliacaoCP } from "../cp/conciliacaocp/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowConciliacaoCP = {
  select: ReactNode;
  id: string;
  data_pagamento: string;
  conta_bancaria: string;
};

const openModal = useStoreConciliacaoCP.getState().openModal;

export const columnsTable: ColumnDef<RowConciliacaoCP>[] = [
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
    enableSorting: false,
    cell: ({ row }) => (
      <div className="px-1">
        <input
          type="checkbox"
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected().toString(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    ),
  },
  {
    header: "AÇÃO",
    accessorKey: "id",
    cell: (info) => (
      <HandCoins
        className="text-blue-500 cursor-pointer"
        onClick={() => openModal(info.getValue<number>().toString())}
      />
    ),
    enableSorting: false,
  },
  {
    header: "DATA TRANSAÇÃO",
    accessorKey: "data_transacao",
    cell: (info) => {
      const data_transacao = info.getValue<string>();
      return <span>{data_transacao && normalizeDate(data_transacao)}</span>;
    },
  },
  {
    header: "DESCRIÇÃO",
    accessorKey: "descricao",
    cell: (info) => {
      const descricao = info.getValue<string>();
      return <span>{descricao}</span>;
    },
  },
  {
    header: "CONTA BANCÁRIA",
    accessorKey: "conta_bancaria",
    cell: (info) => {
      const conta_bancaria = info.getValue<string>();
      return <span>{conta_bancaria}</span>;
    },
  },
  {
    header: "ID TRANSAÇÃO",
    accessorKey: "id_transacao",
    cell: (info) => {
      const id_transacao = info.getValue<string>();
      return <span>{id_transacao}</span>;
    },
  },
  {
    header: "DOCUMENTO",
    accessorKey: "documento",
    cell: (info) => {
      const documento = info.getValue<string>();
      return <span>{documento}</span>;
    },
  },
  {
    header: "VALOR",
    accessorKey: "valor",
    cell: (info) => {
      const valor = info.getValue<string>() || 0;
      return <span>{normalizeCurrency(Math.abs(+valor))}</span>;
    },
  },
  {
    header: "STATUS",
    accessorKey: "conciliado",

    cell: (info) => {
      const conciliado = info.getValue();
      let color = "";
      if (conciliado == 1) {
        color = "text-green-500";
      } else if (conciliado == 0) {
        color = "text-red-500";
      }
      return (
        <span className={`${color}`}>
          {conciliado ? "Conciliado" : "Não Conciliado"}
        </span>
      );
    },
  },
];
