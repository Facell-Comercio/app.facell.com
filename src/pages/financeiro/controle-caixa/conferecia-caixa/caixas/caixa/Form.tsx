import AlertPopUp from "@/components/custom/AlertPopUp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import {
  ConferenciasCaixaSchema,
  useConferenciasCaixa,
} from "@/hooks/financeiro/useConferenciasCaixa";
import { formatDate } from "date-fns";
import {
  History,
  Landmark,
  List,
  Pencil,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import { useState } from "react";
import CaixaCards from "./cards/CaixaCards";
import { ItemAccordionCaixa } from "./components/ItemAccordionCaixa";
import ModalTransacoesCredit, {
  TransacoesCreditProps,
} from "./components/ModalTransacoesCredit";
import StatusCaixa from "./components/StatusCaixa";
import ModalDeposito from "./depositos/ModalDeposito";
import FiltersMovimentos from "./FiltersMovimento";
import { useFormCaixaData } from "./form-data";
import ModalOcorrencias from "./ocorrencias/ModalOcorrencias";
import RowVirtualizedMovimentoCaixa from "./RowVirtualizedMovimentoCaixa";
import { useStoreCaixa } from "./store";

export type FilterMovimentoProps = {
  documento: string;
  tipo_operacao: string;
  forma_pgto: string;
  historico: string;
};

const FormCaixa = ({
  data,
  formRef,
}: {
  data: ConferenciasCaixaSchema;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const [filters, setFilters] = useState<FilterMovimentoProps>({
    documento: "",
    tipo_operacao: "",
    forma_pgto: "",
    historico: "",
  });
  const [modalTransacoesCreditOpen, setModalTransacoesCreditOpen] =
    useState(false);

  const filteredMovimetoCaixa = data.movimentos_caixa?.filter(
    (movimento) =>
      movimento.documento
        ?.toUpperCase()
        .startsWith(filters.documento.toUpperCase()) &&
      movimento.tipo_operacao?.includes(filters.tipo_operacao.toUpperCase()) &&
      movimento.forma_pagamento?.includes(filters.forma_pgto.toUpperCase()) &&
      movimento.historico
        ?.toUpperCase()
        .includes(filters.historico.toUpperCase())
  );

  const qtde_movimentos_caixa = filteredMovimetoCaixa?.length || 0;
  const valor_total_movimentos_caixa = filteredMovimetoCaixa?.reduce(
    (acc: number, curr) => acc + parseFloat(curr.valor || "0"),
    0
  );
  const saldo_anterior = parseFloat(data?.saldo_anterior || "0");
  const saldo_atual = parseFloat(data?.saldo_atual || "0");
  const depositos_caixa = data.depositos_caixa || [];
  const qtde_depositos_caixa = parseInt(data.qtde_depositos_caixa || "0");

  const [openModalDeposito, editModalDeposito, id_filial, disabled, isPending] =
    useStoreCaixa((state) => [
      state.openModalDeposito,
      state.editModalDeposito,
      state.id_filial,
      state.disabled,
      state.isPending,
    ]);

  const { form } = useFormCaixaData(data);
  const { mutate: deleteDeposito } = useConferenciasCaixa().deleteDeposito();

  // ! Verificar a existênicia de erros
  // console.log(form.formState.errors);

  function handleClickNewDeposito() {
    openModalDeposito("");
    editModalDeposito(true);
  }

  function historicoColor(descricao: string) {
    if (descricao.includes("CONFERIDO")) {
      return "text-green-500";
    }
    if (descricao.includes("DESCONFIRMADO ")) {
      return "text-orange-500";
    }
    if (descricao.includes("CONFIRMADO")) {
      return "text-blue-400";
    }
  }

  function InfoMovimentoCaixa() {
    return (
      <Badge variant={"info"} className="text-xs">
        Valor Total: {normalizeCurrency(valor_total_movimentos_caixa)}
      </Badge>
    );
  }

  function InfoDepositos() {
    return (
      <span className="flex gap-1 items-center justify-center">
        <Badge
          variant={data.caixa_anterior_fechado ? "info" : "warning"}
          title={
            data.caixa_anterior_fechado ? "" : "Saldo passível de alteração"
          }
        >
          {`Saldo Anterior: ${normalizeCurrency(saldo_anterior)}`}
        </Badge>
        <Badge variant="info">
          {`Total Depósitos: ${normalizeCurrency(
            depositos_caixa.reduce(
              (acc, deposito) => acc + parseFloat(deposito.valor || "0"),
              0
            )
          )}`}
        </Badge>
        <Badge variant="info">
          {`Saldo Final: ${normalizeCurrency(
            saldo_atual < 0 ? "0" : saldo_atual
          )}`}
        </Badge>
        {parseFloat(data.suprimento_caixa || "0") > 0 && (
          <Badge variant="violet">
            {`Suprimento de Caixa: ${normalizeCurrency(data.suprimento_caixa)}`}
          </Badge>
        )}
      </span>
    );
  }

  const { mutate: insertMultiDepositoExtrato } =
    useConferenciasCaixa().insertMultiDepositoExtrato();

  async function handleMultiSelectionDepositos(itens: TransacoesCreditProps[]) {
    if (itens.length > 0) {
      insertMultiDepositoExtrato({
        id_caixa: data.id || "",
        extratos: itens,
      });
    }

    setModalTransacoesCreditOpen(false);
  }

  return (
    <div className="max-w-full overflow-x-hidden">
      <Form {...form}>
        <form
          ref={formRef}
          className="gap-3 max-w-screen-xl w-full grid grid-cols-1 z-[100]"
        >
          <div className="overflow-auto scroll-thin z-[100] flex flex-col gap-3 max-w-full h-full max-h-[72vh] sm:max-h-[70vh] col-span-2">
            {/* Primeira coluna */}
            <StatusCaixa data={data} />
            <CaixaCards data={data} />
            <ItemAccordionCaixa
              icon={List}
              value={"movimento-caixa"}
              qtde={qtde_movimentos_caixa}
              title="Movimento de Caixa"
              className="flex gap-3 flex-col"
              valorTotal={valor_total_movimentos_caixa}
              info={InfoMovimentoCaixa}
            >
              <FiltersMovimentos filters={filters} setFilters={setFilters} />
              <RowVirtualizedMovimentoCaixa
                data={filteredMovimetoCaixa || []}
              />
            </ItemAccordionCaixa>
            <ItemAccordionCaixa
              icon={Landmark}
              value={"depositos-caixa"}
              qtde={qtde_depositos_caixa}
              title="Depósitos"
              info={InfoDepositos}
              className="flex flex-col items-end justify-end"
            >
              {!disabled && (
                <span className="flex gap-3">
                  <Button
                    className="flex gap-2"
                    onClick={() => setModalTransacoesCreditOpen(true)}
                    disabled={isPending}
                    variant={"tertiary"}
                  >
                    <Search />
                    Procurar Depósito no Extrato
                  </Button>
                  <Button
                    className="flex gap-2"
                    onClick={handleClickNewDeposito}
                    disabled={isPending}
                  >
                    <Plus />
                    Novo Depósito
                  </Button>
                </span>
              )}
              <Table className="bg-background rounded-md">
                <TableHeader>
                  <TableRow>
                    {!disabled && <TableHead>Ações</TableHead>}
                    <TableHead>Conta Bancária</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Comprovante</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {depositos_caixa.map((deposito, index) => (
                    <TableRow key={`deposito ${deposito.id} ${index}`}>
                      {!disabled && (
                        <TableCell className="flex gap-2">
                          <Button
                            variant={"warning"}
                            size={"xs"}
                            className="min-w-10"
                            onClick={() => {
                              openModalDeposito(deposito.id || "");
                            }}
                            disabled={isPending}
                          >
                            <Pencil size={14} />
                          </Button>
                          <AlertPopUp
                            title={"Deseja realmente excluir"}
                            description="Essa ação não pode ser desfeita. O depósito será excluído definitivamente do servidor."
                            action={() => {
                              deleteDeposito(deposito.id || "");
                            }}
                          >
                            <Button
                              variant={"destructive"}
                              size={"xs"}
                              className="min-w-10"
                              disabled={isPending}
                            >
                              <Trash size={14} />
                            </Button>
                          </AlertPopUp>
                        </TableCell>
                      )}
                      <TableCell>{deposito.conta_bancaria}</TableCell>
                      <TableCell>{normalizeCurrency(deposito.valor)}</TableCell>
                      <TableCell>{deposito.comprovante}</TableCell>
                      <TableCell>
                        {normalizeDate(deposito.data_deposito || "")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ItemAccordionCaixa>
            {data?.historico && data?.historico.length > 0 && (
              <section className="flex gap-2 flex-col px-2 py-3 border bg-slate-200 dark:bg-blue-950 rounded-lg">
                <span className="flex gap-3 font-medium">
                  <History />
                  <h3>Histórico</h3>
                </span>

                <ScrollArea className={"flex flex-col gap-3 max-h-44 "}>
                  {data.historico?.map((value, index) => (
                    <span
                      className="flex gap-1.5"
                      key={`historico ${value.id} ${index}`}
                    >
                      {formatDate(value.created_at, "dd/MM/yyyy hh:mm")}:
                      <p className={`${historicoColor(value.descricao)}`}>
                        {value.descricao}
                      </p>
                    </span>
                  ))}
                </ScrollArea>
              </section>
            )}
          </div>
        </form>
      </Form>
      <ModalDeposito id_matriz={data.id_matriz} />
      <ModalOcorrencias id_filial={id_filial || ""} />
      <ModalTransacoesCredit
        id_matriz={data.id_matriz || ""}
        data_transacao={data.data || ""}
        id_caixa={data.id || ""}
        open={modalTransacoesCreditOpen}
        multiSelection
        handleMultiSelection={handleMultiSelectionDepositos}
        onOpenChange={() => setModalTransacoesCreditOpen(false)}
      />
    </div>
  );
};

export default FormCaixa;
