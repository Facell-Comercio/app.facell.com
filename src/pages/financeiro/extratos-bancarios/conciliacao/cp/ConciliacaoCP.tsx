import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useConciliacaoCP } from "@/hooks/financeiro/useConciliacaoCP";
import { useEffect, useRef, useState } from "react";
import FiltersConciliacaoCP from "./tables/Filters";
import { ItemCP } from "./tables/ItemCP";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { exportToExcel } from "@/helpers/importExportXLS";
import { normalizeCurrency } from "@/helpers/mask";
import { Search } from "lucide-react";
import { FaSpinner } from "react-icons/fa6";
import ModalConciliarCP from "./components/ModalConciliar";
import { useStoreConciliacaoCP } from "./components/store";
import { ConciliacoesProps } from "./tables/Conciliacoes";
import { SearchComponent } from "./tables/SearchComponent";
import TitulosConciliados, {
  TitulosConciliadosProps,
} from "./tables/TitulosConciliados";
import TitulosConciliar, {
  VencimentosConciliarProps,
} from "./tables/TitulosConciliar";
import TransacoesConciliadas, {
  TransacoesConciliadasProps,
} from "./tables/TransacoesConciliadas";
import TransacoesConciliar, {
  TransacoesConciliarProps,
} from "./tables/TransacoesConciliar";
import { columnsTable } from "./tables/columns";
import { useStoreTableConciliacaoCP } from "./tables/store-tables";

const ConciliacaoCP = () => {
  const [
    filters,
    rowVencimentosSelection,
    handlerowVencimentosSelection,
    rowTransacoesSelection,
    handleRowTransacoesSelection,
    vencimentosSelection,
    transacoesSelection,
    setDataPagamento,
    dataPagamento,
    showAccordion,
    pagination,
    setPagination,
  ] = useStoreTableConciliacaoCP((state) => [
    state.filters,
    state.rowVencimentosSelection,
    state.handlerowVencimentosSelection,
    state.rowTransacoesSelection,
    state.handleRowTransacoesSelection,
    state.vencimentosSelection,
    state.transacoesSelection,
    state.setDataPagamento,
    state.data_pagamento,
    state.showAccordion,
    state.pagination,
    state.setPagination,
  ]);
  const openModal = useStoreConciliacaoCP.getState().openModal;

  const { data, refetch, isLoading, isError } = useConciliacaoCP().getAll({
    filters,
  });
  const {
    data: dataConciliacoes,
    refetch: refetchConciliacao,
    isLoading: isLoadingConciliacao,
  } = useConciliacaoCP().getConciliacoes({
    filters,
    pagination,
  });

  const {
    mutate: conciliacaoAutomatica,
    isPending,
    isSuccess,
    data: resultadoConciliacaoAutomatica,
  } = useConciliacaoCP().conciliacaoAutomatica();
  const titulosConciliar = data?.data?.titulosConciliar || [];
  const transacoesConciliar = data?.data?.transacoesConciliar || [];
  const titulosConciliados = data?.data?.titulosConciliados || [];
  const transacoesConciliadas = data?.data?.transacoesConciliadas || [];

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
    } else if (
      vencimentosSelection.length === 0 &&
      transacoesSelection.length === 0
    ) {
      setDataPagamento();
    }
  }, [vencimentosSelection, transacoesSelection]);

  const filteredTitulosConciliar = titulosConciliar
    .filter(
      (titulo: VencimentosConciliarProps) =>
        titulo.id_titulo.toString().includes(searchFilters.tituloConciliar) ||
        titulo.descricao.toString().includes(searchFilters.tituloConciliar) ||
        titulo.filial.toString().includes(searchFilters.tituloConciliar) ||
        titulo.nome_fornecedor
          .toString()
          .includes(searchFilters.tituloConciliar)
    )
    .filter((titulo: VencimentosConciliarProps) =>
      dataPagamento
        ? titulo.data_pagamento.toString() === dataPagamento
        : titulo
    );

  const filteredTitulosConciliados = titulosConciliados.filter(
    (titulo: TitulosConciliadosProps) =>
      titulo.id_titulo.toString().includes(searchFilters.tituloConciliado) ||
      titulo.descricao.toString().includes(searchFilters.tituloConciliado) ||
      titulo.filial.toString().includes(searchFilters.tituloConciliado) ||
      titulo.nome_fornecedor.toString().includes(searchFilters.tituloConciliado)
  );
  const filteredTransacoesConciliar = transacoesConciliar
    .filter(
      (transacao: TransacoesConciliarProps) =>
        transacao.id_transacao
          .toString()
          .includes(searchFilters.transacaoConciliar) ||
        transacao.descricao
          .toString()
          .includes(searchFilters.transacaoConciliar) ||
        transacao.doc.toString().includes(searchFilters.transacaoConciliar)
    )
    .filter((transacao: TransacoesConciliarProps) =>
      dataPagamento
        ? transacao.data_transacao.toString() === dataPagamento
        : transacao
    );
  const filteredTransacoesConciliadas = transacoesConciliadas.filter(
    (transacao: TransacoesConciliadasProps) =>
      transacao.id_transacao
        .toString()
        .includes(searchFilters.transacaoConciliada) ||
      transacao.descricao
        .toString()
        .includes(searchFilters.transacaoConciliada) ||
      transacao.doc.toString().includes(searchFilters.transacaoConciliada)
  );
  const filteredConciliacoes = dataConciliacoes?.data.filter(
    (transacao: ConciliacoesProps) =>
      transacao.tipo
        .toString()
        .includes(searchFilters.conciliacao.toUpperCase()) ||
      transacao.responsavel
        .toString()
        .includes(searchFilters.conciliacao.toUpperCase()) ||
      transacao.valor_transacoes
        .toString()
        .includes(searchFilters.conciliacao.toUpperCase())
  );

  const totalTitulos = titulosConciliar.reduce(
    (acc: number, val: VencimentosConciliarProps) =>
      acc + parseFloat(val.valor),
    0
  );
  const totalTransacoes = transacoesConciliar.reduce(
    (acc: number, val: TransacoesConciliarProps) => acc + parseFloat(val.valor),
    0
  );
  const totalSelectedTitulos = vencimentosSelection
    .reduce((acc, val) => acc + parseFloat(val.valor), 0)
    .toFixed(2);
  const totalSelectedTransacoes = transacoesSelection
    .reduce((acc, val) => acc + parseFloat(val.valor), 0)
    .toFixed(2);

  useEffect(() => {
    if (isSuccess && resultadoConciliacaoAutomatica) {
      toast({
        title: "Sucesso",
        description: "Conciliações realizadas",
        action: (
          <ToastAction
            altText="Ver Resultados"
            onClick={() =>
              exportToExcel(
                resultadoConciliacaoAutomatica,
                `RESULTADO CONCILIAÇÃO AUTOMÁTICA`
              )
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
  const searchRef = useRef<HTMLInputElement | null>(null);
  console.log(totalSelectedTitulos, totalSelectedTransacoes);

  const [itemOpen, setItemOpen] = useState<string>("nao-conciliado");
  return (
    <div className="flex flex-col gap-3">
      <FiltersConciliacaoCP
        refetch={refetch}
        refetchConciliacao={refetchConciliacao}
      />
      {filters.id_conta_bancaria &&
        filters.range_data &&
        filters.range_data.from &&
        filters.range_data.to &&
        showAccordion && (
          <Accordion
            type="single"
            collapsible
            value={itemOpen}
            onValueChange={(e) => setItemOpen(e)}
            className="px-2 py-1 border dark:border-slate-800 rounded-lg "
          >
            <ItemCP
              title="Não conciliado"
              value="nao-conciliado"
              className="flex-col"
            >
              <div className="flex justify-end gap-2 transition-all">
                <Button
                  type={"button"}
                  variant={"outline"}
                  onClick={() => {
                    if (
                      !vencimentosSelection.length ||
                      !transacoesSelection.length
                    ) {
                      toast({
                        title: "Selecione os títulos e as transações!",
                        description:
                          "É necessário que sejam selecionados no mínimo um título e uma transação bancária",
                        variant: "warning",
                      });
                    } else if (
                      totalSelectedTitulos !== totalSelectedTransacoes
                    ) {
                      toast({
                        title: "Valores incorretos!",
                        description:
                          "O total dos títulos e das transações não são iguais",
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
                      id_conta_bancaria: filters.id_conta_bancaria,
                    });
                  }}
                >
                  {isPending ? (
                    <Button disabled variant={"outline"}>
                      <span className="flex gap-2 w-full items-center justify-center">
                        <FaSpinner size={18} className="me-2 animate-spin" />{" "}
                        Conciliando...
                      </span>
                    </Button>
                  ) : (
                    <Button type={"button"} variant={"outline"}>
                      Conciliação Automática
                    </Button>
                  )}
                </AlertPopUp>
              </div>
              <section className="grid grid-cols-2 max-w-full gap-2 grid-nowrap">
                <Card className="grid-nowrap overflow-y border-0 bg-secondary">
                  <CardHeader className="flex flex-row items-end justify-between gap-2 w-full p-0 pb-2 px-2">
                    <CardTitle className="text-md">Vencimentos</CardTitle>
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
                    <CardTitle className="text-md">
                      Transações Bancárias
                    </CardTitle>
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
              <section className="grid grid-cols-2 w-full gap-2 grid-nowrap">
                <Card className="h-full grid-nowrap overflow-y border-0 bg-secondary">
                  <CardHeader className="flex flex-row items-end justify-between gap-2 w-full p-0 pb-2 px-2">
                    <CardTitle className="text-md">Vencimentos</CardTitle>
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
                    <CardTitle className="text-md">
                      Transações Bancárias
                    </CardTitle>
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
            <ItemCP
              title="Conciliações Realizadas"
              value="conciliacoes-realizadas"
              className="flex-col"
            >
              <div className="flex gap-3">
                <Input
                  ref={searchRef}
                  type="search"
                  placeholder="Buscar..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSearchFilters({
                        ...searchFilters,
                        conciliacao: searchRef.current?.value || "",
                      });
                    }
                  }}
                  className="h-9"
                />
                <Button
                  size={"sm"}
                  variant={"tertiary"}
                  className="flex gap-0.5"
                  onClick={() =>
                    setSearchFilters({
                      ...searchFilters,
                      conciliacao: searchRef.current?.value || "",
                    })
                  }
                >
                  <Search size={18} className="me-2" /> Procurar
                </Button>
              </div>
              <DataTable
                pagination={pagination}
                setPagination={setPagination}
                data={filteredConciliacoes}
                rowCount={dataConciliacoes?.data.length}
                columns={columnsTable}
                isLoading={isLoadingConciliacao}
              />
            </ItemCP>
          </Accordion>
        )}
      <ModalConciliarCP />
    </div>
  );
};

export default ConciliacaoCP;
