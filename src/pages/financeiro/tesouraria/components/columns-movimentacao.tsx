import { Button } from "@/components/ui/button";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { ColumnDef } from "@tanstack/react-table";
import { Ban, Check, Search } from "lucide-react";
import { useStoreTesouraria } from "../store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowConferenciaCaixa = {
  id: string;
  adiantamento: boolean;
  id_titulo_adiantamento: string;
  data_transacao: string;
  descricao: string;
  tipo: string;
  valor: string;
};

const openModal = useStoreTesouraria.getState().openModalTitulosPagar;

function ButtonAdiantamento({
  isAdiantamento,
  id_titulo,
  onClick,
}: {
  isAdiantamento: boolean;
  id_titulo: string;
  onClick: () => void;
}) {
  if (!isAdiantamento) {
    return (
      <Button size={"xs"} disabled variant={"secondary"}>
        <Ban size={14} />
      </Button>
    );
  }
  if (isAdiantamento && !id_titulo) {
    return (
      <Button size={"xs"} variant={"tertiary"} onClick={onClick}>
        <Search size={14} />
      </Button>
    );
  }
  if (isAdiantamento && id_titulo) {
    return (
      <Button size={"xs"} variant={"success"} disabled>
        <Check size={14} />
      </Button>
    );
  }
}

export const columnsTableMovimentacao: ColumnDef<RowConferenciaCaixa>[] = [
  {
    header: "Ação",
    accessorKey: "id_titulo_adiantamento",
    cell: (info) => {
      const id = info.getValue<string>();
      const isAdiantamento = info.row.original.adiantamento;
      const id_extrato_bancario = info.row.original.id;
      const valor = info.row.original.valor;

      return (
        <ButtonAdiantamento
          isAdiantamento={isAdiantamento}
          id_titulo={id}
          onClick={() => openModal({ id: id_extrato_bancario, valor })}
        />
      );
    },
  },
  {
    header: "Data",
    accessorKey: "data_transacao",
    cell: (info) => {
      const label = info.getValue<string>();
      return <span>{normalizeDate(label)}</span>;
    },
  },
  {
    header: "Tipo",
    accessorKey: "tipo_transacao",
    cell: (info) => {
      const label = info.getValue<string>() === "CREDIT" ? "CRÉDITO" : "DÉBITO";
      return <span className="uppercase">{label}</span>;
    },
  },
  {
    header: "Descrição",
    accessorKey: "descricao",
    cell: (info) => {
      const label = info.getValue<string>();
      return <span className="uppercase">{label}</span>;
    },
  },
  {
    header: "Valor",
    accessorKey: "valor",
    cell: (info) => {
      const label = info.getValue<number>();
      return <span>{normalizeCurrency(label)}</span>;
    },
  },
];
