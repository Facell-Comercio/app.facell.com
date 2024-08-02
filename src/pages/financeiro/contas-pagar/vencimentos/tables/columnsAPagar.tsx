import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Banknote, CreditCard, Landmark } from "lucide-react";
import { ReactNode } from "react";
import { useStoreCartao } from "../../cartoes/cartao/store";
import { useStoreTitulo } from "../../titulos/titulo/store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowTitulo = {
  select: ReactNode;
  id_titulo: string;
  id_vencimento: string;
  data_vencimento: Date;
  data_prevista: Date;
  valor: string;
  num_doc: string;
  nome_fornecedor: string;
  filial: string;
  descricao: string;
  tipo: "vencimento" | "fatura";
};

const openModal = useStoreTitulo.getState().openModal;
const openModalFatura = useStoreCartao.getState().openModalFatura;

export const columnsTableAPagar: ColumnDef<RowTitulo>[] = [
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
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected().toString(),
            onCheckedChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    ),
  },
  {
    id: "id_forma_pagamento",
    header: "forma",
    accessorKey: "id_forma_pagamento",
    cell: (info) => {
      const id_forma_pagamento = parseInt(info.getValue<string>());
      if (id_forma_pagamento === 3) {
        return (
          <Button
            className="w-full py-1 max-h-8 text-xs text-center border-none bg-green-700 hover:bg-green-700"
            size={"xs"}
            onClick={() => openModal({ id: info.row.original.id_titulo })}
          >
            <Banknote size={16} />
          </Button>
        );
      } else if (id_forma_pagamento === 6) {
        return (
          <Button
            className="w-full py-1 max-h-8 text-xs text-center border-none bg-violet-700 hover:bg-violet-600"
            size={"xs"}
            onClick={() => openModalFatura(info.row.original.id_vencimento)}
          >
            <CreditCard size={16} />
          </Button>
        );
      } else {
        return (
          <Button
            className="w-full py-1.5 max-h-8 text-xs text-center border-none bg-zinc-700 hover:bg-zinc-700"
            size={"xs"}
            onClick={() => openModal({ id: info.row.original.id_titulo })}
          >
            <Landmark size={16} />
          </Button>
        );
      }
    },
    enableSorting: false,
  },
  {
    id: "id_titulo",
    header: "ID TÍTULO",
    accessorKey: "id_titulo",
    cell: (info) => (
      <span className="flex font-semibold truncate max-w-96">
        {info.row.original.tipo === "vencimento"
          ? info.getValue<string>()
          : "-"}
      </span>
    ),
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
        <span title={label} className="block text-right text-nowrap">
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
        <div title={label} className="block truncate max-w-96 uppercase">
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
        <div title={label} className="block truncate max-w-96 uppercase">
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
        <div title={label} className="block truncate max-w-96 uppercase">
          {label}
        </div>
      );
    },
  },
];
