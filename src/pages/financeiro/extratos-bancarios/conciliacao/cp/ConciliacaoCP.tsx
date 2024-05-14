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
import { useState } from "react";
import FiltersConciliacaoCP from "./tables/Filters";
import { ItemCP } from "./tables/ItemCP";
import { SearchComponent } from "./tables/SearchComponent";

import { Button } from "@/components/ui/button";
import ModalConciliarCP from "./components/ModalConciliar";
import { useStoreConciliacaoCP } from "./components/store";
import TitulosConciliados, {
  TitulosConciliadosProps,
} from "./tables/TitulosConciliados";
import TitulosConciliar, {
  TitulosConciliarProps,
} from "./tables/TitulosConciliar";
import TransacoesConciliadas, {
  TransacoesConciliadasProps,
} from "./tables/TransacoesConciliadas";
import TransacoesConciliar, {
  TransacaoConciliarProps,
} from "./tables/TransacoesConciliar";
import { useStoreTableConciliacaoCP } from "./tables/store-tables";

const ConciliacaoCP = () => {
  console.log("RENDER - Section ConciliacaoCP");
  const [
    filters,
    rowTitulosSelection,
    handleRowTitulosSelection,
    rowTransacoesSelection,
    handleRowTransacoesSelection,
    titulosSelection,
    transacoesSelection,
  ] = useStoreTableConciliacaoCP((state) => [
    state.filters,
    state.rowTitulosSelection,
    state.handleRowTitulosSelection,
    state.rowTransacoesSelection,
    state.handleRowTransacoesSelection,
    state.titulosSelection,
    state.transacoesSelection,
  ]);
  const openModal = useStoreConciliacaoCP.getState().openModal;

  const { data, refetch, isLoading, isError } = useConciliacaoCP().getAll({
    filters,
  });
  const titulosConciliar = data?.data?.titulosConciliar || [];
  const titulosConciliados = data?.data?.titulosConciliados || [];
  const transacoesConciliar = data?.data?.transacoesConciliar || [];
  const transacoesConciliadas = data?.data?.transacoesConciliadas || [];

  const [searchFilters, setSearchFilters] = useState({
    tituloConciliar: "",
    tituloConciliado: "",
    transacaoConciliar: "",
    transacaoConciliada: "",
    conciliacao: "",
  });

  console.log("IDS", titulosSelection, transacoesSelection);

  const filteredTitulosConciliar = titulosConciliar.filter(
    (titulo: TitulosConciliarProps) =>
      titulo.id_titulo.toString().includes(searchFilters.tituloConciliar) ||
      titulo.descricao.toString().includes(searchFilters.tituloConciliar) ||
      titulo.filial.toString().includes(searchFilters.tituloConciliar) ||
      titulo.nome_fornecedor.toString().includes(searchFilters.tituloConciliar)
  );
  const filteredTitulosConciliados = titulosConciliados.filter(
    (titulo: TitulosConciliadosProps) =>
      titulo.id_titulo.toString().includes(searchFilters.tituloConciliado) ||
      titulo.descricao.toString().includes(searchFilters.tituloConciliado) ||
      titulo.filial.toString().includes(searchFilters.tituloConciliado) ||
      titulo.nome_fornecedor.toString().includes(searchFilters.tituloConciliado)
  );
  const filteredTransacoesConciliar = transacoesConciliar.filter(
    (titulo: TransacaoConciliarProps) =>
      titulo.id_transacao
        .toString()
        .includes(searchFilters.transacaoConciliar) ||
      titulo.descricao.toString().includes(searchFilters.transacaoConciliar) ||
      titulo.doc.toString().includes(searchFilters.transacaoConciliar)
  );
  const filteredTransacoesConciliadas = transacoesConciliadas.filter(
    (titulo: TransacoesConciliadasProps) =>
      titulo.id_transacao
        .toString()
        .includes(searchFilters.transacaoConciliada) ||
      titulo.descricao.toString().includes(searchFilters.transacaoConciliada) ||
      titulo.doc.toString().includes(searchFilters.transacaoConciliada)
  );

  const [itemOpen, setItemOpen] = useState<string>("nao-conciliado");
  return (
    <div className="flex flex-col gap-3">
      <FiltersConciliacaoCP refetch={refetch} />
      <Accordion
        type="single"
        collapsible
        value={itemOpen}
        onValueChange={(e) => setItemOpen(e)}
        className="px-2 py-1 border-2 dark:border-slate-800 rounded-lg "
      >
        <ItemCP
          title="Não conciliado"
          value="nao-conciliado"
          className="flex-col"
        >
          <div className="flex justify-end gap-2">
            <Button onClick={() => openModal("")}>Conciliação Manual</Button>
            <Button>Conciliação Automática</Button>
          </div>
          <section className="flex max-w-full gap-2 flex-nowrap">
            <Card className="w-1/2 flex-nowrap overflow-y border-0 bg-slate-900">
              <CardHeader className="flex flex-row items-end justify-between gap-2 w-full p-0 pb-2 px-2">
                <CardTitle className="text-md">Títulos</CardTitle>
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
                  rowSelection={rowTitulosSelection}
                  handleRowSelection={handleRowTitulosSelection}
                />
              </CardContent>
              <CardFooter className="flex justify-between p-2 mt-auto">
                <Badge variant={"dark"}>
                  <p className="me-1">Valor Total: </p>100
                </Badge>
                <Badge variant={"dark"}>
                  <p className="me-1">Valor Total Selecionado: </p>4000
                </Badge>
              </CardFooter>
            </Card>

            <Card className="h-full w-1/2 flex-nowrap border-0 bg-slate-900">
              <CardHeader className="flex flex-row items-end justify-between gap-2 w-full p-0 pb-2 px-2">
                <CardTitle className="text-md">Transações Bancárias</CardTitle>
                <span className="flex gap-2">
                  <SearchComponent
                    searchFilters={searchFilters}
                    setSearchFilters={setSearchFilters}
                    name="transacaoConciliar"
                  />
                  <Button variant={"tertiary"} size={"xs"}>
                    Tratar Duplicidade
                  </Button>
                </span>
              </CardHeader>
              <CardContent className="px-0 py-0 overflow-auto">
                <TransacoesConciliar
                  data={filteredTransacoesConciliar}
                  isLoading={isLoading}
                  isError={isError}
                  rowSelection={rowTransacoesSelection}
                  handleRowSelection={handleRowTransacoesSelection}
                />
              </CardContent>
              <CardFooter className="flex justify-between p-2 mt-auto">
                <Badge variant={"dark"}>
                  <p className="me-1">Valor Total Selecionado: </p>4000
                </Badge>
                <Badge variant={"dark"}>
                  <p className="me-1">Valor Total: </p>100
                </Badge>
              </CardFooter>
            </Card>
          </section>
        </ItemCP>

        <ItemCP title="Conciliado" value="conciliado">
          <Card className="w-1/2 flex-nowrap overflow-y border-0 bg-slate-900">
            <CardHeader className="flex flex-row items-end justify-between gap-2 w-full p-0 pb-2 px-2">
              <CardTitle className="text-md">Títulos</CardTitle>
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
            <CardFooter className="flex justify-between p-2 mt-auto">
              <Badge variant={"dark"}>
                <p className="me-1">Valor Total: </p>100
              </Badge>
              <Badge variant={"dark"}>
                <p className="me-1">Valor Total Selecionado: </p>4000
              </Badge>
            </CardFooter>
          </Card>
          <Card className="h-full w-1/2 flex-nowrap border-0 bg-slate-900">
            <CardHeader className="flex flex-row items-end justify-between gap-2 w-full p-0 pb-2 px-2">
              <CardTitle className="text-md">Transações Bancárias</CardTitle>
              <SearchComponent
                searchFilters={searchFilters}
                setSearchFilters={setSearchFilters}
                name="transacaoConciliada"
              />
            </CardHeader>
            <CardContent className="px-0 py-0 overflow-auto">
              <TransacoesConciliadas
                data={filteredTransacoesConciliadas}
                isLoading={isLoading}
                isError={isError}
              />
            </CardContent>
            <CardFooter className="flex justify-between p-2 mt-auto">
              <Badge variant={"dark"}>
                <p className="me-1">Valor Total Selecionado: </p>4000
              </Badge>
              <Badge variant={"dark"}>
                <p className="me-1">Valor Total: </p>100
              </Badge>
            </CardFooter>
          </Card>
        </ItemCP>
        <ItemCP title="Conciliações Realizadas" value="conciliacoes-realizadas">
          <div className="flex flex-wrap flex-1 min-w-96 bg-slate-200">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure
            quaerat asperiores pariatur impedit eum amet dolores velit
            laudantium aut veniam itaque laborum cum doloribus possimus
            praesentium, dolorem soluta! Illum, sequi!
          </div>
          <div className="flex flex-wrap flex-1 min-w-96 bg-slate-400">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure
            quaerat asperiores pariatur impedit eum amet dolores velit
            laudantium aut veniam itaque laborum cum doloribus possimus
            praesentium, dolorem soluta! Illum, sequi!
          </div>
        </ItemCP>
      </Accordion>
      <ModalConciliarCP />
    </div>
  );
};

export default ConciliacaoCP;
