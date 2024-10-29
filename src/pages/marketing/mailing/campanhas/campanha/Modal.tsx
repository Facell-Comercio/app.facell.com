import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ButtonMotivation from "@/components/custom/ButtonMotivation";
import { DataVirtualTableHeaderFixed } from "@/components/custom/DataVirtualTableHeaderFixed";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMailing } from "@/hooks/marketing/useMailing";
import { DialogDescription } from "@radix-ui/react-dialog";
import { CopyPlus, Plus, RefreshCcw, Smartphone, UserPen, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ButtonExportSubcampanhas from "./components/ButtonExportarEvolux";
import { ClienteProps, columnsTableClientes } from "./components/columns-clientes";
import { columnsTableClientesSubcampanha } from "./components/columns-clientes-campanha";
import { FiltersClientesCampanha } from "./components/FiltersClientesCampanha";
import ModalDefinirAparelho from "./components/modais/ModalDefinirAparelho";
import ModalDefinirVendedores from "./components/modais/ModalDefinirVendedores";
import ModalDuplicarCampanha from "./components/modais/ModalDuplicarCampanha";
import ModalEditarCliente from "./components/modais/ModalEditarCliente";
import ModalNovaSubcampanha from "./components/modais/ModalNovaSubcampanha";
import ModalVerCliente from "./components/modais/ModalVerCliente";
import { useStoreCampanha } from "./store";

const ModalCampanha = () => {
  const [
    id,
    modalOpen,
    closeModal,

    openModalNovaSubcampanha,
    openModalDuplicarCampanha,
    openModalDefinirAparelho,
    openModalDefinirVendedores,

    filters,
    setFilters,
    resetFilters,
    filters_lote,
    setFiltersLote,
    resetFiltersLote,
  ] = useStoreCampanha((state) => [
    state.id,
    state.modalOpen,
    state.closeModal,

    state.openModalNovaSubcampanha,
    state.openModalDuplicarCampanha,
    state.openModalDefinirAparelho,
    state.openModalDefinirVendedores,

    state.filters,
    state.setFilters,
    state.resetFilters,
    state.filters_lote,
    state.setFiltersLote,
    state.resetFiltersLote,
  ]);

  const [idSubcampanha, setIdSubcampanha] = useState<string | undefined>();

  const { data, isFetching, isSuccess, isLoading, refetch } = useMailing().getOneCampanha({
    id: id || "",
    filters,
  });
  const defaultFilters = data?.filters;
  const {
    data: data_subcampanha,
    isLoading: isLoadingSubcampanha,
    isFetching: isFetchingSubcampanha,
    refetch: refetchSubcampanha,
  } = useMailing().getOneCampanha({
    id: idSubcampanha,
    filters: filters_lote,
  });
  const {
    mutate: deleteClientesLote,
    isPending: deleteClientesLoteIsPending,
    isSuccess: deleteClientesLoteIsSuccess,
  } = useMailing().deleteClientesLote();
  const { mutate: reimportarEvolux, isPending: reimportarEvoluxIsPending } =
    useMailing().reimportarEvolux();

  const handleResetFilterCampanha = async () => {
    await new Promise((resolve) => resolve(resetFilters()));
    refetch();
  };
  useEffect(() => {
    handleResetFilterCampanha();
  }, [deleteClientesLoteIsSuccess]);

  const subcampanhas = useMemo(
    () => data?.subcampanhas || [],
    [isLoading, isFetching, data_subcampanha, data]
  );

  const defaultFiltersSubcampanha = data_subcampanha?.filters;
  const defaultIdSubcampanha = useMemo(
    () => subcampanhas && subcampanhas[0] && subcampanhas[0].id,
    [subcampanhas]
  );

  useEffect(() => {
    setIdSubcampanha(defaultIdSubcampanha);
    setFiltersLote({ id_campanha: defaultIdSubcampanha });
  }, [isSuccess]);

  const handleResetFilterSubcampanha = async () => {
    await new Promise((resolve) => resolve(resetFiltersLote()));
    refetchSubcampanha();
  };
  useEffect(() => {
    if (idSubcampanha) {
      handleResetFilterSubcampanha();
      setFiltersLote({ id_campanha: idSubcampanha });
    }
  }, [idSubcampanha]);
  const [itemOpen, setItemOpen] = useState<string>("clientes");
  const disabledCampanha = isLoading || deleteClientesLoteIsPending || reimportarEvoluxIsPending;
  const disabledSubcampanha = isLoadingSubcampanha;
  const clientes: ClienteProps[] = data?.clientes || [];
  const clientesSubcampanha: ClienteProps[] = data_subcampanha?.clientes || [];

  useEffect(() => {
    setItemOpen(subcampanhas.length > 0 ? "" : "clientes");
  }, [subcampanhas]);

  function handleClickCancel() {
    closeModal();
  }
  return (
    <Dialog open={modalOpen} onOpenChange={() => handleClickCancel()}>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>Campanha: {data?.nome}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex flex-col gap-3 max-h-[80vh] sm:max-h-[70vh]">
          <div className="grid gap-3 w-full overflow-auto scroll-thin p-3 bg-slate-200 dark:bg-blue-950 rounded-md">
            <Accordion
              type="single"
              collapsible
              value={itemOpen}
              onValueChange={(e) => setItemOpen(e)}
              className="grid border rounded-md bg-background"
            >
              <AccordionItem value="clientes" className="border-0">
                <AccordionTrigger className="p-3 border-0 rounded-md py-1 hover:no-underline">
                  Clientes
                </AccordionTrigger>
                <AccordionContent className="flex gap-2 flex-col p-2">
                  <div className="grid gap-2 max-w-full">
                    <span className="flex gap-2 w-full justify-between">
                      <FiltersClientesCampanha
                        filters={filters}
                        defaultFilters={defaultFilters}
                        refetch={refetch}
                        setFilters={setFilters}
                        resetFilters={resetFilters}
                        qtde_clientes={data?.qtde_clientes}
                        isPending={isLoading || isFetching}
                        disabled={disabledCampanha}
                      />
                      {data?.qtde_clientes > 0 && (
                        <span className="flex flex-wrap justify-end gap-2 w-full">
                          <ButtonMotivation
                            title="Exclui os clientes que foram filtrados..."
                            variant={"destructive"}
                            action={() => deleteClientesLote({ id_campanha: id || "", filters })}
                            headerTitle="Excluir clientes filtrados"
                            description={`Digite "${String(
                              data?.nome
                            ).toUpperCase()}" para poder remover os clientes`}
                            placeholder={data?.nome}
                            disabled={disabledCampanha}
                            equalText
                          >
                            <X className="me-2" size={18} /> Excluir Clientes
                          </ButtonMotivation>

                          <Button
                            onClick={() => openModalDuplicarCampanha(data?.qtde_clientes)}
                            disabled={disabledCampanha}
                            variant={"tertiary"}
                          >
                            <CopyPlus className="me-2" size={18} /> Duplicar Campanha
                          </Button>
                          <Button
                            onClick={() => openModalNovaSubcampanha(data?.qtde_clientes)}
                            disabled={disabledCampanha}
                          >
                            <Plus className="me-2" size={18} /> Nova Subcampanha
                          </Button>
                        </span>
                      )}
                    </span>
                    <div className="grid overflow-auto bg-background rounded-lg ">
                      <DataVirtualTableHeaderFixed
                        // @ts-ignore
                        columns={columnsTableClientes}
                        data={clientes}
                        className={`h-[300px] border`}
                        isLoading={isLoading || isFetching}
                      />
                    </div>
                    <span className="flex justify-end">
                      <Badge variant={"secondary"}>
                        Quantidade de Clientes: {data?.qtde_clientes}
                      </Badge>
                    </span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {defaultIdSubcampanha && (
              <Tabs defaultValue={defaultIdSubcampanha} className="w-full">
                <TabsList
                  className={`w-full justify-start flex h-auto bg-background ${
                    !idSubcampanha && "hidden"
                  }`}
                >
                  <div className="grid">
                    <ScrollArea className="w-fill whitespace-nowrap rounded-md h-auto">
                      {subcampanhas?.map((subcampanha: any) => (
                        <TabsTrigger
                          className={"data-[state=active]:bg-secondary"}
                          value={subcampanha?.id}
                          onClick={() => {
                            setIdSubcampanha(subcampanha.id);
                            setFiltersLote({ id_campanha: subcampanha?.id });
                          }}
                          key={`${subcampanha.id} - ${subcampanha.nome}`}
                        >
                          {subcampanha?.nome}
                        </TabsTrigger>
                      ))}

                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                </TabsList>
                {subcampanhas?.map((subcampanha: any) => (
                  <TabsContent
                    value={subcampanha?.id}
                    key={`${subcampanha.id} - ${subcampanha.nome}`}
                  >
                    <div className="grid gap-2 bg-background rounded-md w-full p-2">
                      <span className="flex w-full justify-between">
                        <FiltersClientesCampanha
                          filters={filters_lote}
                          defaultFilters={defaultFiltersSubcampanha}
                          refetch={refetchSubcampanha}
                          setFilters={setFiltersLote}
                          resetFilters={resetFiltersLote}
                          qtde_clientes={data_subcampanha?.qtde_clientes}
                          isPending={isLoadingSubcampanha || isFetchingSubcampanha}
                          isSubcampanha
                          disabled={disabledSubcampanha}
                        />
                        <span className="flex flex-wrap justify-end gap-2">
                          <Button
                            onClick={() => reimportarEvolux(data_subcampanha.id)}
                            disabled={disabledSubcampanha}
                          >
                            <RefreshCcw className="me-2" size={18} /> Reimportar Evolux
                          </Button>
                          <ButtonExportSubcampanhas disabled={disabledSubcampanha} />
                          <Button
                            variant={"warning"}
                            onClick={() =>
                              openModalDefinirAparelho(data_subcampanha?.qtde_clientes)
                            }
                            disabled={disabledSubcampanha}
                          >
                            <Smartphone className="me-2" size={18} /> Definir Aparelhos
                          </Button>
                          <Button
                            variant={"tertiary"}
                            onClick={() =>
                              openModalDefinirVendedores(data_subcampanha?.qtde_clientes)
                            }
                            disabled={disabledSubcampanha}
                          >
                            <UserPen className="me-2" size={18} /> Definir Vendedores
                          </Button>
                        </span>
                      </span>
                      <div className="grid bg-background rounded-lg ">
                        <DataVirtualTableHeaderFixed
                          // @ts-ignore
                          columns={columnsTableClientesSubcampanha}
                          data={clientesSubcampanha}
                          className={`h-[300px] border`}
                          isLoading={isLoadingSubcampanha || isFetchingSubcampanha}
                        />
                      </div>
                      <span className="flex justify-end">
                        <Badge variant={"secondary"}>
                          Quantidade de Clientes: {data_subcampanha?.qtde_clientes}
                        </Badge>
                      </span>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        </ScrollArea>

        {/* Modais */}
        <ModalNovaSubcampanha />
        <ModalEditarCliente />
        <ModalVerCliente />
        <ModalDefinirAparelho />
        <ModalDefinirVendedores />
        <ModalDuplicarCampanha />

        <DialogFooter className="flex gap-2 items-end flex-wrap">
          <Button variant={"secondary"} onClick={handleClickCancel}>
            <X size={18} className="me-2" /> Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCampanha;
