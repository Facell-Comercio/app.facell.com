import { Button } from "@/components/ui/button";
import { checkUserDepartments, checkUserPermission } from "@/helpers/checkAuthorization";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { useTesouraria } from "@/hooks/financeiro/useTesouraria";
import { ColumnDef } from "@tanstack/react-table";
import { Ban, Check, Pen, Search, Trash2 } from "lucide-react";
import { useStoreTesouraria } from "../store";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RowConferenciaCaixa = {
  id: string;
  adiantamento: boolean;
  suprimento: boolean;
  id_titulo_adiantamento: string;
  data_transacao: string;
  descricao: string;
  tipo: string;
  valor: string;
  allowAction: boolean;
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

const openModalAdiantamento = useStoreTesouraria.getState().openModalAdiantamento;
const openModalSuprimento = useStoreTesouraria.getState().openModalSuprimento;

export const columnsTableMovimentacao: ColumnDef<RowConferenciaCaixa>[] = [
  {
    header: "Ação",
    accessorKey: "id_titulo_adiantamento",
    cell: (info) => {
      const id = info.getValue<string>();

      const isAdiantamento = info.row.original.adiantamento;
      const isSuprimento = info.row.original.suprimento;

      const id_extrato_bancario = info.row.original.id;
      const valor = info.row.original.valor;
      const allowAction = !!info.row.original.allowAction;
      const gestorOuMaster =
        checkUserDepartments("FINANCEIRO", true) || checkUserPermission("MASTER");

      function handleClickUpdate(id: string) {
        //! ATUALIZAR SALDO DA CONTA NO BACK-END
        if (isAdiantamento) {
          openModalAdiantamento(id);
        }
        if (isSuprimento) {
          openModalSuprimento(id);
        }
      }
      const { mutate: deleteTransacao } = useTesouraria().deleteTransacao();

      return (
        <span className="flex gap-1">
          <ButtonAdiantamento
            isAdiantamento={isAdiantamento}
            id_titulo={id}
            onClick={() => openModal({ id: id_extrato_bancario, valor })}
          />
          {allowAction && gestorOuMaster && (
            <>
              <Button
                size={"xs"}
                variant={"warning"}
                onClick={() => handleClickUpdate(id_extrato_bancario)}
              >
                <Pen size={14} />
              </Button>
              <Button
                size={"xs"}
                variant={"destructive"}
                onClick={() => deleteTransacao(id_extrato_bancario)}
              >
                <Trash2 size={14} />
              </Button>
            </>
          )}
        </span>
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
      const isCredit = info.getValue<string>() === "CREDIT";
      const label = isCredit ? "CRÉDITO" : "DÉBITO";
      return (
        <span className={`uppercase ${isCredit ? "text-success" : "text-red-500"}`}>{label}</span>
      );
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
      const isCredit = label >= 0;
      return (
        <span className={`${isCredit ? "text-success" : "text-red-500"}`}>
          {normalizeCurrency(label)}
        </span>
      );
    },
  },
];
