"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { checkUserPermission } from "@/helpers/checkAuthorization";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowLeftRight } from "lucide-react";
import { ReactNode } from "react";
import { useStoreMeuOrcamento } from "../orcamento/store";
// import { useStoreMeuOrcamento } from "../orcamento/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowMeuOrcamento = {
  select: ReactNode;
  id: string;
  centro_de_custo: string;
  plano_contas: string;
  valor_previsto: string;
  saldo: string;
  realizado_percentual: string;
};

const openModal = useStoreMeuOrcamento.getState().openModal;

// ^ Realizar a filtragem dinâmica para a apresentação do grupo econômico ++ Liberar ou não a visualização para o usuário dependendo da quantidade de centro de custos dele

export const columnsTable: ColumnDef<RowMeuOrcamento>[] = checkUserPermission(
  "MASTER"
)
  ? [
    {
      id: "select",
      header: ({ table }) => (
        <div className="px-1">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
        <div title="Transferir">
          <ArrowLeftRight
            className="text-blue-500 cursor-pointer"
            onClick={() => openModal(info.getValue<number>().toString())}
          />
        </div>
      ),
      enableSorting: false,
    },
    {
      header: "GRUPO ECONOMICO",
      accessorKey: "grupo_economico",
      cell: (info) => {
        const grupo_economico = info.getValue<string>();
        return <span>{grupo_economico}</span>;
      },
    },
    {
      header: "CENTRO DE CUSTO",
      accessorKey: "centro_custos",
      cell: (info) => {
        const centro_custos = info.getValue<string>();
        return <span>{centro_custos}</span>;
      },
    },
    {
      header: "PLANO DE CONTAS",
      accessorKey: "plano_contas",
      cell: (info) => {
        const plano_contas = info.getValue<string>();
        return <span>{plano_contas && plano_contas.toUpperCase()}</span>;
      },
    },
    {
      header: "PREVISTO",
      accessorKey: "valor_previsto",
      cell: (info) => {
        const valor_previsto = info.getValue<string>();
        return <span>{valor_previsto}</span>;
      },
    },
    {
      header: "SALDO",
      accessorKey: "saldo",
      cell: (info) => {
        const saldo = info.getValue<string>();
        return <span>{saldo}</span>;
      },
    },
    {
      header: "% Realizado",
      accessorKey: "realizado_percentual",
      cell: (info) => {
        const percentual = info.getValue<number>();
        return (
          <span>
            {percentual && parseFloat((+percentual * 100).toFixed(2))}%
          </span>
        );
      },
    },
  ]
  : [
    {
      id: "select",
      header: ({ table }) => (
        <div className="px-1">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
    // {
    //   header: "GRUPO ECONOMICO",
    //   accessorKey: "grupo_economico",
    //   cell: (info) => {
    //     const grupo_economico = info.getValue<string>();
    //     return <span>{grupo_economico}</span>;
    //   },
    // },
    {
      header: "CENTRO DE CUSTO",
      accessorKey: "centro_custos",
      cell: (info) => {
        const centro_custos = info.getValue<string>();
        return <span>{centro_custos}</span>;
      },
    },
    {
      header: "PLANO DE CONTAS",
      accessorKey: "plano_contas",
      cell: (info) => {
        const plano_contas = info.getValue<string>();
        return <span>{plano_contas}</span>;
      },
    },
    {
      header: "PREVISTO",
      accessorKey: "valor_previsto",
      cell: (info) => {
        const valor_previsto = info.getValue<string>();
        return <span>{valor_previsto && valor_previsto}</span>;
      },
    },
    {
      header: "SALDO",
      accessorKey: "saldo",
      cell: (info) => {
        const saldo = info.getValue<string>();
        return <span>{saldo && saldo}</span>;
      },
    },
    {
      header: "% Realizado",
      accessorKey: "realizado_percentual",
      cell: (info) => {
        const percentual = info.getValue<number>();
        return (
          <span>
            {percentual && parseFloat((+percentual * 100).toFixed(2))}%
          </span>
        );
      },
    },
  ];
