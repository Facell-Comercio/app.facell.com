import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useConciliacaoCP } from "@/hooks/financeiro/useConciliacaoCP";
import { useEffect, useState } from "react";
import { ItemCP } from "./tables/ItemCP";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { exportToExcel } from "@/helpers/importExportXLS";
import { normalizeCurrency } from "@/helpers/mask";
import { FaSpinner } from "react-icons/fa6";
import ModalConciliarCP from "./components/ModalConciliar";
import ModalExtratosCredit, { ItemExtratosCredit } from "./components/ModalExtratosCredit";
import ModalExtratosDuplicated, {
  ItemExtratosDuplicated,
} from "./components/ModalExtratosDuplicados";
import { useStoreConciliacaoCP } from "./components/store";
import { FiltersRealizados } from "./tables/Filters";
import { SearchComponent } from "./tables/SearchComponent";
import TitulosConciliados, { TitulosConciliadosProps } from "./tables/TitulosConciliados";
import TitulosConciliar, { VencimentosConciliarProps } from "./tables/TitulosConciliar";
import TransacoesConciliadas, { TransacoesConciliadasProps } from "./tables/TransacoesConciliadas";
import TransacoesConciliar, { TransacoesConciliarProps } from "./tables/TransacoesConciliar";
import { columnsTable } from "./tables/columns";
import { useStoreTableConciliacaoCP } from "./tables/store-tables";

import { DatePickerWithRange } from "@/components/ui/date-range";
import { RefreshCcw } from "lucide-react";
import { useExtratosStore } from "../../context";
import ChartConciliacaoPagamentos from "./components/ChartConciliacaoPagamentos";

const ConciliacaoCP = () => {
  const [modalExtratosCreditOpen, setModalExtratosCreditOpen] = useState(false);
  const [modalExtratosDuplicatedOpen, setModalExtratosDuplicatedOpen] = useState(false);

  const { contaBancaria, ano, mes } = useExtratosStore((state) => ({
    ano: state.ano,
    mes: state.mes,
    contaBancaria: state?.contaBancaria,
  }));

  const [
    filtersConciliacoes,
    rowVencimentosSelection,
    handlerowVencimentosSelection,
    rowTransacoesSelection,
    handleRowTransacoesSelection,
    resetSelectionTransacoes,
    vencimentosSelection,
    transacoesSelection,
    setDataPagamento,
    dataPagamento,
    pagination,
    setPagination,
    filters,
    setFilters,
    resetSelections,
  ] = useStoreTableConciliacaoCP((state) => [
    state.filtersConciliacoes,
    state.rowVencimentosSelection,
    state.handlerowVencimentosSelection,
    state.rowTransacoesSelection,
    state.handleRowTransacoesSelection,
    state.resetSelectionTransacoes,
    state.vencimentosSelection,
    state.transacoesSelection,
    state.setDataPagamento,
    state.data_pagamento,
    state.pagination,
    state.setPagination,
    state.filters,
    state.setFilters,
    state.resetSelections,
  ]);

  const openModal = useStoreConciliacaoCP.getState().openModal;

  const { data, refetch, isLoading, isError, isFetching } = useConciliacaoCP().getAll({
    filters: { id_conta_bancaria: contaBancaria?.id, ano, mes, range_data: filters.range_data },
  });
  const dataChartConciliacaoPagamentos = data?.dataChartConciliacaoPagamentos;

  // * Dados das conciliações realizadas:
  const {
    data: dataConciliacoes,
    refetch: refetchConciliacoes,
    isLoading: isLoadingConciliacoes,
  } = useConciliacaoCP().getConciliacoes({
    filters: {
      ...filtersConciliacoes,
      id_conta_bancaria: contaBancaria?.id,
      id_filial: contaBancaria?.id_filial,
    },
    pagination,
  });

  const rowsConciliacoes = dataConciliacoes?.rows || [];
  const rowCountConciliacoes = dataConciliacoes?.rowCount || 0;

  // ~ Operações
  // * Conciliação Automática
  const {
    mutate: conciliacaoAutomatica,
    isPending,
    isSuccess,
    data: resultadoConciliacaoAutomatica,
  } = useConciliacaoCP().conciliacaoAutomatica();

  // * Conciliação de Tarifas + Criação título
  const {
    mutate: conciliacaoTarifas,
    isPending: isPendingTarifas,
    isSuccess: isSuccessTarifas,
    data: resultadoConciliacaoTarifas,
  } = useConciliacaoCP().conciliacaoTarifas();

  // * Conciliação Transferência entre contas
  const {
    mutate: conciliacaoTransferenciaContas,
    isPending: isPendingTransferenciaContas,
    isSuccess: isSuccessTransferenciaContas,
  } = useConciliacaoCP().conciliacaoTransferenciaContas();

  // * Tratamento de duplicidade
  const {
    mutate: tratarDuplicidade,
    isPending: isPendingTratarDuplicidade,
    isSuccess: isSuccessTratarDuplicidade,
  } = useConciliacaoCP().tratarDuplicidade();

  useEffect(() => {
    if (isSuccessTransferenciaContas || isSuccessTratarDuplicidade) {
      resetSelectionTransacoes([]);
    }
  }, [isSuccessTransferenciaContas || isSuccessTratarDuplicidade]);

  const titulosConciliar = data?.titulosConciliar || [];
  const transacoesConciliar = data?.transacoesConciliar || [];
  const titulosConciliados = data?.titulosConciliados || [];
  const transacoesConciliadas = data?.transacoesConciliadas || [];
  const bancoComFornecedor = data?.bancoComFornecedor || false;

  const [searchFilters, setSearchFilters] = useState({
    tituloConciliar: "",
    tituloConciliado: "",
    transacaoConciliar: "",
    transacaoConciliada: "",
    conciliacao: "",
  });

  useEffect(() => {
    if (vencimentosSelection.length === 1) {
      setDataPagamento(vencimentosSelection[0].data_pagamento);
    } else if (transacoesSelection.length === 1) {
      setDataPagamento(transacoesSelection[0].data_transacao);
    } else if (vencimentosSelection.length === 0 && transacoesSelection.length === 0) {
      setDataPagamento();
    }
  }, [vencimentosSelection, transacoesSelection]);

  const filteredTitulosConciliar = titulosConciliar
    .filter(
      (titulo: VencimentosConciliarProps) =>
        String(titulo.id_titulo).includes(searchFilters.tituloConciliar) ||
        String(titulo.descricao).includes(searchFilters.tituloConciliar) ||
        String(titulo.filial).includes(searchFilters.tituloConciliar) ||
        String(titulo.nome_fornecedor).includes(searchFilters.tituloConciliar)
    )
    .filter((titulo: VencimentosConciliarProps) =>
      dataPagamento ? String(titulo.data_pagamento) === dataPagamento : titulo
    );

  const filteredTitulosConciliados = titulosConciliados.filter(
    (titulo: TitulosConciliadosProps) =>
      String(titulo.id_titulo).includes(searchFilters.tituloConciliado) ||
      String(titulo.descricao).includes(searchFilters.tituloConciliado) ||
      String(titulo.filial).includes(searchFilters.tituloConciliado) ||
      String(titulo.nome_fornecedor).includes(searchFilters.tituloConciliado)
  );

  const filteredTransacoesConciliar = transacoesConciliar
    .filter(
      (transacao: TransacoesConciliarProps) =>
        String(transacao.id_transacao).includes(searchFilters.transacaoConciliar) ||
        String(transacao.descricao).includes(searchFilters.transacaoConciliar) ||
        String(transacao.doc).includes(searchFilters.transacaoConciliar)
    )
    .filter((transacao: TransacoesConciliarProps) =>
      dataPagamento ? String(transacao.data_transacao) === dataPagamento : transacao
    );
  const filteredTransacoesConciliadas = transacoesConciliadas.filter(
    (transacao: TransacoesConciliadasProps) =>
      String(transacao.id_transacao).includes(searchFilters.transacaoConciliada) ||
      String(transacao.descricao).includes(searchFilters.transacaoConciliada) ||
      String(transacao.doc).includes(searchFilters.transacaoConciliada)
  );

  const totalTitulos = titulosConciliar.reduce(
    (acc: number, val: VencimentosConciliarProps) => acc + parseFloat(val.valor_pago || "0"),
    0
  );
  const totalTransacoes = transacoesConciliar.reduce(
    (acc: number, val: TransacoesConciliarProps) => acc + parseFloat(val.valor),
    0
  );
  const totalSelectedTitulos = vencimentosSelection
    .reduce((acc, val) => acc + parseFloat(val.valor_pago || "0"), 0)
    .toFixed(2);
  const totalSelectedTransacoes = transacoesSelection
    .reduce((acc, val) => acc + parseFloat(val.valor), 0)
    .toFixed(2);

  useEffect(() => {
    if (isSuccess && resultadoConciliacaoAutomatica) {
      toast({
        title: "Sucesso",
        description: "Conciliações conciliacoes",
        action: (
          <ToastAction
            altText="Ver Resultados"
            onClick={() =>
              exportToExcel(resultadoConciliacaoAutomatica, `RESULTADO CONCILIAÇÃO AUTOMÁTICA`)
            }
          >
            Ver Resultados
          </ToastAction>
        ),
        duration: 3500,
        variant: "success",
      });
    }
  }, [isSuccess]);

  //^ Verificar a necessidade da devolução dessa planilha
  useEffect(() => {
    if (isSuccessTarifas && resultadoConciliacaoTarifas) {
      const retorno = resultadoConciliacaoTarifas.map((result: any) => ({
        "ID TÍTULO": result.id_titulo,
        FORNECEDOR: result.fornecedor,
        FILIAL: result.filial,
        "DATA PAGAMENTO": result.data_pagamento,
        "VALOR PAGO": result.valor_pago,
        "ID TRANSAÇÃO": result.id_transacao,
        DESCRIÇÃO: result.descricao,
        DOC: result.doc,
        CONCILIADO: result.conciliado ? "SIM" : "NÃO",
        ERROR: result.error,
      }));

      const tarifasNaoConciliadas = resultadoConciliacaoTarifas
        .filter((tConciliada: any) => !tConciliada.conciliado)
        .map((tConciliada: any) => tConciliada.id_transacao);

      const filteredTarifas = transacoesSelection.filter((transacao) => {
        return tarifasNaoConciliadas.includes(transacao.id_transacao);
      });

      toast({
        title: "Sucesso",
        description: "Lançamento de tarifas realizado",
        action: (
          <ToastAction
            altText="Ver Resultados"
            onClick={() => exportToExcel(retorno, `RESULTADO LANÇAMENTO DAS TARIFAS`)}
          >
            Ver Resultados
          </ToastAction>
        ),
        duration: 3500,
        variant: "success",
      });

      resetSelectionTransacoes(filteredTarifas);
    }
  }, [isSuccessTarifas]);

  function handleSelectionExtratosCredit(extrato: ItemExtratosCredit) {
    conciliacaoTransferenciaContas({
      id_conta_bancaria: contaBancaria && String(contaBancaria?.id || ""),
      id_saida: transacoesSelection[0].id,
      id_entrada: extrato.id,
      valor: extrato.valor,
    });
  }

  function handleSelectionExtratosDuplicated(extrato: ItemExtratosDuplicated) {
    tratarDuplicidade({
      id_extrato: transacoesSelection[0].id,
      id_duplicidade: extrato.id,
    });
  }

  // * Quando o ano ou mês forem alterados, vamos resetar o range_datas:
  const firstDay = new Date(parseInt(ano), parseInt(mes) - 1, 1);
  const endDay = new Date(parseInt(ano), parseInt(mes), 0);

  useEffect(() => {
    setFilters({ range_data: { from: firstDay, to: endDay } });
  }, [ano, mes]);

  //* Reseta as seleções ao receber um novo data ou ao alterar o período do filtro
  useEffect(() => {
    resetSelections();
  }, [data, filters.range_data?.from, filters.range_data?.to]);

  const [itemOpen, setItemOpen] = useState<string>("nao-conciliado");
  const [realizadosOpen, setRealizadosOpen] = useState<string>("");
  return (
    <div className="flex flex-col gap-3">
      <ChartConciliacaoPagamentos data={dataChartConciliacaoPagamentos} isLoading={isFetching} />

      <div className="flex gap-3 justify-end">
        <DatePickerWithRange
          disabled={!contaBancaria}
          date={filters.range_data}
          fromMonth={firstDay}
          fromYear={parseInt(ano)}
          toMonth={endDay}
          toYear={parseInt(ano)}
          numberOfMonths={1}
          setDate={(val) => {
            setFilters({ range_data: val });
          }}
        />
        <Button disabled={isFetching || !contaBancaria} onClick={() => refetch()}>
          <RefreshCcw size={20} className={`${isFetching ? "animate-spin" : ""} me-2`} /> Atualizar
        </Button>
      </div>

      {contaBancaria && ano && mes && (
        <Accordion
          type="single"
          collapsible
          value={itemOpen}
          onValueChange={(e) => setItemOpen(e)}
          className="px-2 py-1 border dark:border-slate-800 rounded-lg "
        >
          <ItemCP title="Não conciliado" value="nao-conciliado" className="flex-col">
            <ScrollArea className="w-fill whitespace-nowrap rounded-md md:pb-2.5 lg:pb-1">
              <div className="flex justify-end gap-2 transition-all">
                {transacoesSelection.length === 1 && (
                  <Button
                    type={"button"}
                    variant={"outline"}
                    disabled={isPendingTratarDuplicidade}
                    onClick={() => {
                      setModalExtratosDuplicatedOpen(true);
                    }}
                  >
                    Tratar como Duplicidade
                  </Button>
                )}
                {transacoesSelection.length === 1 && (
                  <Button
                    type={"button"}
                    variant={"outline"}
                    disabled={isPendingTransferenciaContas}
                    onClick={() => {
                      setModalExtratosCreditOpen(true);
                    }}
                  >
                    Transferência entre Contas
                  </Button>
                )}
                <Button
                  type={"button"}
                  variant={"outline"}
                  onClick={() => {
                    if (!vencimentosSelection.length || !transacoesSelection.length) {
                      toast({
                        title: "Selecione os títulos e as transações!",
                        description:
                          "É necessário que sejam selecionados no mínimo um título e uma transação bancária",
                        variant: "warning",
                      });
                    } else if (totalSelectedTitulos !== totalSelectedTransacoes) {
                      toast({
                        title: "Valores incorretos!",
                        description: "O total dos títulos e das transações não são iguais",
                        variant: "warning",
                      });
                    } else {
                      openModal("");
                    }
                  }}
                >
                  Conciliação Manual
                </Button>
                <AlertPopUp
                  title={"Deseja realmente realizar a conciliação?"}
                  description="A conciliação de alguns títulos e de algumas transações será feita automaticamente"
                  action={() => {
                    conciliacaoAutomatica({
                      vencimentos: filteredTitulosConciliar,
                      transacoes: filteredTransacoesConciliar,
                      id_conta_bancaria: contaBancaria && String(contaBancaria?.id || ""),
                    });
                  }}
                >
                  {isPending ? (
                    <Button disabled variant={"outline"}>
                      <span className="flex gap-2 w-full items-center justify-center">
                        <FaSpinner size={18} className="me-2 animate-spin" /> Conciliando...
                      </span>
                    </Button>
                  ) : (
                    <Button type={"button"} variant={"outline"}>
                      Conciliação Automática
                    </Button>
                  )}
                </AlertPopUp>
                <span
                  title={
                    !bancoComFornecedor
                      ? "Defina o fornecedor deste banco em cadastro de bancos para poder lançar as tarifas"
                      : transacoesSelection.length > 0
                      ? ""
                      : "Selecione no mínimo 1 tarifa"
                  }
                >
                  <AlertPopUp
                    title={"Deseja realmente realizar essa operação?"}
                    description="As tarifas serão lançadas e a concilição realizada automaticamente"
                    action={() => {
                      // Talvez verificar a existência de um "TAR" na descrição
                      conciliacaoTarifas({
                        tarifas: transacoesSelection,
                        id_conta_bancaria: contaBancaria && String(contaBancaria?.id || ""),
                        data_transacao: transacoesSelection[0].data_transacao,
                      });
                    }}
                  >
                    {isPendingTarifas ? (
                      <Button disabled variant={"outline"}>
                        <span className="flex gap-2 w-full items-center justify-center">
                          <FaSpinner size={18} className="me-2 animate-spin" /> Lançando...
                        </span>
                      </Button>
                    ) : (
                      <Button
                        disabled={!bancoComFornecedor || transacoesSelection.length === 0}
                        type={"button"}
                        variant={"outline"}
                      >
                        Lançar Tarifas
                      </Button>
                    )}
                  </AlertPopUp>
                </span>
              </div>

              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <section className="grid grid-cols-1 md:grid-cols-2 max-w-full gap-2 grid-nowrap">
              <Card className="grid-nowrap overflow-y border-0 bg-secondary">
                <CardHeader className="flex flex-row items-end justify-between gap-2 w-full p-0 pb-2 px-2">
                  <CardTitle className="text-md text-nowrap">Vencimentos</CardTitle>
                  <SearchComponent
                    searchFilters={searchFilters}
                    setSearchFilters={setSearchFilters}
                    name="tituloConciliar"
                  />
                </CardHeader>
                <CardContent className="px-0 py-0">
                  <TitulosConciliar
                    data={filteredTitulosConciliar}
                    isLoading={isLoading}
                    isError={isError}
                    rowSelection={rowVencimentosSelection}
                    handleRowSelection={handlerowVencimentosSelection}
                    vencimentosSelection={vencimentosSelection.map(
                      (titulo) => titulo.id_vencimento
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between p-2 mt-auto">
                  <Badge variant={"info"}>
                    <p className="me-1">Total: </p>
                    {normalizeCurrency(totalTitulos)}
                  </Badge>
                  <Badge variant={"info"}>
                    <p className="me-1">Total Selecionado: </p>
                    {normalizeCurrency(totalSelectedTitulos)}
                  </Badge>
                </CardFooter>
              </Card>

              <Card className="h-full grid-nowrap border-0 bg-secondary">
                <CardHeader className="flex flex-row items-end justify-between gap-2 w-full p-0 pb-2 px-2">
                  <CardTitle className="text-md text-nowrap">Transações Bancárias</CardTitle>
                  <span className="flex gap-2">
                    <SearchComponent
                      searchFilters={searchFilters}
                      setSearchFilters={setSearchFilters}
                      name="transacaoConciliar"
                    />
                    {/* <Button variant={"tertiary"} size={"xs"}>
                        Tratar Duplicidade
                      </Button> */}
                  </span>
                </CardHeader>
                <CardContent className="px-0 py-0 overflow-auto">
                  <TransacoesConciliar
                    data={filteredTransacoesConciliar}
                    isLoading={isLoading}
                    isError={isError}
                    rowSelection={rowTransacoesSelection}
                    handleRowSelection={handleRowTransacoesSelection}
                    transacoesSelection={transacoesSelection.map(
                      (transacao) => transacao.id_transacao
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between p-2 mt-auto">
                  <Badge variant={"info"}>
                    <p className="me-1">Total Selecionado: </p>
                    {normalizeCurrency(totalSelectedTransacoes)}
                  </Badge>
                  <Badge variant={"info"}>
                    <p className="me-1">Total: </p>
                    {normalizeCurrency(totalTransacoes)}
                  </Badge>
                </CardFooter>
              </Card>
            </section>
          </ItemCP>

          <ItemCP title="Conciliado" value="conciliado">
            <section className="grid grid-cols-1 md:grid-cols-2 w-full gap-2 grid-nowrap">
              <Card className="h-full grid-nowrap overflow-y border-0 bg-secondary">
                <CardHeader className="flex flex-row items-end justify-between gap-2 w-full p-0 pb-2 px-2">
                  <CardTitle className="text-md text-nowrap">Vencimentos</CardTitle>
                  <SearchComponent
                    searchFilters={searchFilters}
                    setSearchFilters={setSearchFilters}
                    name="tituloConciliado"
                  />
                </CardHeader>
                <CardContent className="px-0 py-0">
                  <TitulosConciliados
                    data={filteredTitulosConciliados}
                    isLoading={isLoading}
                    isError={isError}
                  />
                </CardContent>
              </Card>
              <Card className="h-full grid-nowrap overflow-y border-0 bg-secondary">
                <CardHeader className="flex flex-row items-end justify-between gap-2 w-full p-0 pb-2 px-2">
                  <CardTitle className="text-md text-nowrap">Transações Bancárias</CardTitle>
                  <SearchComponent
                    searchFilters={searchFilters}
                    setSearchFilters={setSearchFilters}
                    name="transacaoConciliada"
                  />
                </CardHeader>
                <CardContent className="px-0 py-0">
                  <TransacoesConciliadas
                    data={filteredTransacoesConciliadas}
                    isLoading={isLoading}
                    isError={isError}
                  />
                </CardContent>
              </Card>
            </section>
          </ItemCP>
        </Accordion>
      )}
      <ModalConciliarCP />

      {contaBancaria && (
        <Accordion
          type="single"
          collapsible
          value={realizadosOpen}
          onValueChange={(e) => setRealizadosOpen(e)}
          className="px-2 py-1 border dark:border-slate-800 rounded-lg "
        >
          <ItemCP
            title="Conciliações Realizadas"
            value="conciliacoes-conciliacoes"
            className="flex-col"
          >
            <FiltersRealizados refetch={refetchConciliacoes} />
            <DataTable
              pagination={pagination}
              setPagination={setPagination}
              data={rowsConciliacoes}
              rowCount={rowCountConciliacoes}
              columns={columnsTable}
              isLoading={isLoadingConciliacoes}
            />
          </ItemCP>
        </Accordion>
      )}
      <ModalExtratosCredit
        open={modalExtratosCreditOpen}
        onOpenChange={() => setModalExtratosCreditOpen(false)}
        handleSelection={handleSelectionExtratosCredit}
        filters={{
          data_transacao:
            transacoesSelection.length === 1 ? transacoesSelection[0].data_transacao : undefined,
          valor:
            transacoesSelection.length === 1 ? parseFloat(transacoesSelection[0].valor) : undefined,
        }}
      />
      <ModalExtratosDuplicated
        open={modalExtratosDuplicatedOpen}
        onOpenChange={() => setModalExtratosDuplicatedOpen(false)}
        handleSelection={handleSelectionExtratosDuplicated}
        filters={{
          id_conta_bancaria: contaBancaria && String(contaBancaria?.id || ""),
          id_extrato: transacoesSelection.length === 1 ? transacoesSelection[0].id : undefined,
          descricao:
            transacoesSelection.length === 1 ? transacoesSelection[0].descricao : undefined,
          data_transacao:
            transacoesSelection.length === 1 ? transacoesSelection[0].data_transacao : undefined,
          valor:
            transacoesSelection.length === 1 ? parseFloat(transacoesSelection[0].valor) : undefined,
        }}
      />
    </div>
  );
};

export default ConciliacaoCP;
