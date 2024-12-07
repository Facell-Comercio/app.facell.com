import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ButtonMotivation from "@/components/custom/ButtonMotivation";
import { DataTable } from "@/components/custom/DataTable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { checkUserDepartments, hasPermission } from "@/helpers/checkAuthorization";
import { useMailing } from "@/hooks/marketing/useMailing";
import { DialogDescription } from "@radix-ui/react-dialog";
import { CopyPlus, Plus, Smartphone, Trash, UserPen, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
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

const defaultCampanhaData = {
  qtde_clientes: 0,
  qtde_all_clientes: 0,
};

const ModalCampanha = () => {
  const [
    id,
    modalOpen,
    closeModal,
    resetId,

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

    pagination,
    setPagination,
    resetPagination,
    paginationSubcampanha,
    setPaginationSubcampanha,
    resetPaginationSubcampanha,
  ] = useStoreCampanha((state) => [
    state.id,
    state.modalOpen,
    state.closeModal,
    state.resetId,

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

    state.pagination,
    state.setPagination,
    state.resetPagination,
    state.paginationSubcampanha,
    state.setPaginationSubcampanha,
    state.resetPaginationSubcampanha,
  ]);
  const canEdit = checkUserDepartments("MARKETING", true) || hasPermission("MASTER");

  const [idSubcampanha, setIdSubcampanha] = useState<string>("");
  const [campanhaData, setCampanhaData] = useState(defaultCampanhaData);

  const { data, isFetching, isSuccess, isLoading, refetch } = useMailing().getOneCampanha({
    id: id || "",
    filters,
    pagination,
  });

  //* EVITANDO RE-RENDERIZAÇÃO DESNCECESSÁRIA
  const [qtdeClientes, setQtdeClientes] = useState(data?.qtde_clientes);
  useEffect(() => {
    if (data?.qtde_clientes && data?.qtde_clientes !== qtdeClientes) {
      setQtdeClientes(data?.qtde_clientes);
    }
  }, [data?.qtde_clientes]);

  const qtde_all_clientes = data?.qtde_all_clientes;
  const defaultFilters = data?.filters;
  const rowCount = useMemo(() => qtdeClientes, [qtdeClientes]);

  const {
    data: data_subcampanha,
    isLoading: isLoadingSubcampanha,
    isFetching: isFetchingSubcampanha,
    refetch: refetchSubcampanha,
  } = useMailing().getOneCampanha({
    id: idSubcampanha,
    filters: filters_lote,
    pagination: paginationSubcampanha,
  });

  //* EVITANDO RE-RENDERIZAÇÃO DESNCECESSÁRIA
  const [qtdeClientesSubcampanha, setQtdeClientesSubcampanha] = useState(
    data_subcampanha?.qtde_clientes
  );
  useEffect(() => {
    if (
      data_subcampanha?.qtde_clientes !== undefined &&
      data_subcampanha?.qtde_clientes !== qtdeClientesSubcampanha
    ) {
      setQtdeClientesSubcampanha(data_subcampanha?.qtde_clientes);
    }
  }, [data_subcampanha?.qtde_clientes]);

  const qtde_all_clientes_subcampanha = data_subcampanha?.qtde_all_clientes;
  const rowCountSubcampanha = useMemo(() => qtdeClientesSubcampanha, [qtdeClientesSubcampanha]);

  const {
    mutate: deleteClientesLote,
    isPending: deleteClientesLoteIsPending,
    isSuccess: deleteClientesLoteIsSuccess,
  } = useMailing().deleteClientesLote();
  const {
    mutate: deleteClientesSubcampanhaLote,
    isPending: deleteClientesSubcampanhaLoteIsPending,
    isSuccess: deleteClientesSubcampanhaLoteIsSuccess,
  } = useMailing().deleteClientesLote();

  const { mutate: updateCampanha, isPending: updateCampanhaIsPending } =
    useMailing().updateCampanha();
  const { mutate: deleteSubcampanha, isPending: deleteSubcampanhaIsPending } =
    useMailing().deleteSubcampanha();

  const handleResetFilterCampanha = async () => {
    if (id) {
      await new Promise((resolve) => resolve(resetFilters()));
      refetch();
    }
  };
  const handleResetFilterSubcampanha = async () => {
    if (idSubcampanha) {
      await new Promise((resolve) => resolve(resetFiltersLote()));
      refetchSubcampanha();
    }
  };

  async function resetFiltersDelete(type: "campanha" | "subcampanha") {
    if (campanhaData.qtde_clientes !== campanhaData.qtde_all_clientes) {
      if (type === "campanha") {
        handleResetFilterCampanha();
      }
      if (type === "subcampanha") {
        handleResetFilterCampanha();
        handleResetFilterSubcampanha();
      }
    }
    setCampanhaData(defaultCampanhaData);
  }
  useEffect(() => {
    deleteClientesLoteIsSuccess && resetFiltersDelete("campanha");
  }, [deleteClientesLoteIsPending]);

  useEffect(() => {
    deleteClientesSubcampanhaLoteIsSuccess && resetFiltersDelete("subcampanha");
  }, [deleteClientesSubcampanhaLoteIsPending]);

  const subcampanhas = useMemo(
    () => data?.subcampanhas || [],
    [isLoading, isFetching, data_subcampanha, data]
  );

  const defaultFiltersSubcampanha = data_subcampanha?.filters;
  const defaultIdSubcampanha = useMemo(
    () => (subcampanhas && subcampanhas[0] && String(subcampanhas[0].id)) || "",
    [subcampanhas, data, idSubcampanha]
  );
  useEffect(() => {
    if (defaultIdSubcampanha) {
      setIdSubcampanha(defaultIdSubcampanha);
    }
  }, [defaultIdSubcampanha]);

  useEffect(() => {
    setIdSubcampanha(defaultIdSubcampanha);
    setFiltersLote({ id_campanha: defaultIdSubcampanha });
  }, [isSuccess, defaultIdSubcampanha]);

  useEffect(() => {
    if (idSubcampanha) {
      handleResetFilterSubcampanha();
      setFiltersLote({ id_campanha: idSubcampanha });
    }
  }, [idSubcampanha]);
  const [itemOpen, setItemOpen] = useState<string>("clientes");
  const disabledCampanha = isLoading || deleteClientesLoteIsPending;
  const disabledSubcampanha =
    isLoadingSubcampanha ||
    isFetchingSubcampanha ||
    deleteSubcampanhaIsPending ||
    deleteClientesSubcampanhaLoteIsPending;
  const clientes: ClienteProps[] = useMemo(
    () => data?.clientes || [],
    [isFetching, isLoading, data]
  );
  const clientesSubcampanha: ClienteProps[] = useMemo(
    () => data_subcampanha?.clientes || [],
    [isFetchingSubcampanha]
  );

  // useEffect(() => {
  //   setItemOpen(subcampanhas.length > 0 ? "" : "clientes");
  // }, [subcampanhas]);

  function handleClickCancel() {
    closeModal();
  }

  const activeSubcampanha = useCallback(
    (id: string) =>
      String(id) === String(idSubcampanha || defaultIdSubcampanha) ? "active" : "inactive",
    [idSubcampanha]
  );
  const selectedSubcampanha = useCallback(
    (id: string) => String(id) === String(idSubcampanha || defaultIdSubcampanha),
    [idSubcampanha]
  );

  return (
    <Dialog open={modalOpen} onOpenChange={() => handleClickCancel()}>
      <DialogContent className="max-w-7xl">
        <DialogHeader className="flex flex-row gap-2 items-end">
          <DialogTitle className="w-full">Campanha: {data?.nome}</DialogTitle>
          {canEdit && (
            <span className="flex gap-2">
              <span className="flex items-center text-nowrap gap-2">
                <label className="text-xs">Ativo</label>
                <Switch
                  checked={data?.active}
                  onCheckedChange={(value) => updateCampanha({ id: id || "", active: value })}
                  className="mt-0 h-6"
                  defaultChecked={false}
                  disabled={updateCampanhaIsPending || isLoading}
                />
              </span>
              <span className="flex items-center text-nowrap gap-2">
                <label className="text-xs">Público</label>
                <Switch
                  checked={data?.public}
                  onCheckedChange={(value) => updateCampanha({ id: id || "", public: value })}
                  className="mt-0 h-6"
                  defaultChecked={false}
                  disabled={updateCampanhaIsPending || isLoading}
                />
              </span>
            </span>
          )}
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
                        qtde_clientes={qtdeClientes}
                        isPending={isLoading || isFetching}
                        disabled={disabledCampanha}
                        resetPagination={resetPagination}
                      />
                      {qtdeClientes > 0 && canEdit && (
                        <span className="flex flex-wrap justify-end gap-2 w-full">
                          <ButtonMotivation
                            title="Exclui os clientes que foram filtrados..."
                            variant={"destructive"}
                            action={() => {
                              if (qtde_all_clientes === qtdeClientes) {
                                resetId();
                                closeModal();
                              }
                              deleteClientesLote({ id_campanha: id || "", filters });
                              setCampanhaData({
                                qtde_all_clientes: qtde_all_clientes,
                                qtde_clientes: qtdeClientes,
                              });
                            }}
                            headerTitle="Excluir clientes filtrados"
                            description={`Digite "${String(data?.nome)
                              .trim()
                              .toUpperCase()}" para poder remover os clientes`}
                            placeholder={data?.nome.trim().toUpperCase()}
                            disabled={disabledCampanha}
                            equalText
                          >
                            <X className="me-2" size={18} /> Excluir Clientes
                          </ButtonMotivation>

                          <Button
                            onClick={() => openModalDuplicarCampanha(qtdeClientes)}
                            disabled={disabledCampanha}
                            variant={"tertiary"}
                          >
                            <CopyPlus className="me-2" size={18} /> Duplicar Campanha
                          </Button>
                          <Button
                            onClick={() => openModalNovaSubcampanha(qtdeClientes)}
                            disabled={disabledCampanha}
                          >
                            <Plus className="me-2" size={18} /> Nova Subcampanha
                          </Button>
                        </span>
                      )}
                    </span>
                    <div className="overflow-auto bg-background rounded-lg">
                      <DataTable
                        pagination={pagination}
                        setPagination={setPagination}
                        data={clientes}
                        rowCount={rowCount}
                        columns={columnsTableClientes}
                        isLoading={isLoading || isFetching}
                        variant="secondary"
                        fixed
                        maxHeight={50}
                      />
                    </div>
                    <span className="flex justify-end">
                      <Badge variant={"secondary"}>
                        Quantidade Total de Clientes: {qtdeClientes}
                      </Badge>
                    </span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {subcampanhas.length > 0 && (
              <Tabs defaultValue={defaultIdSubcampanha} className="w-full">
                <TabsList
                  className={`w-full justify-start flex h-auto bg-background ${
                    subcampanhas.length === 0 && "hidden"
                  }`}
                >
                  <div className="grid">
                    <ScrollArea className="w-fill whitespace-nowrap rounded-md h-auto">
                      {subcampanhas?.map((subcampanha: any) => (
                        <TabsTrigger
                          className={"data-[state=active]:bg-secondary"}
                          value={String(subcampanha.id)}
                          onClick={() => {
                            setIdSubcampanha(String(subcampanha.id));
                            setFiltersLote({ id_campanha: String(subcampanha.id) });
                          }}
                          key={`${subcampanha.id} - ${subcampanha.nome}`}
                          aria-selected={selectedSubcampanha(subcampanha?.id)}
                          data-state={activeSubcampanha(subcampanha?.id)}
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
                    value={String(subcampanha.id)}
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
                          qtde_clientes={qtdeClientesSubcampanha}
                          isPending={isLoadingSubcampanha || isFetchingSubcampanha || isFetching}
                          isSubcampanha
                          disabled={disabledSubcampanha}
                          resetPagination={resetPaginationSubcampanha}
                        />
                        <span className="flex flex-wrap justify-end gap-2">
                          {canEdit && (
                            <>
                              <ButtonMotivation
                                title="Retorna os clintes para fora da subcampanha..."
                                variant={"destructive"}
                                action={() => {
                                  if (qtde_all_clientes_subcampanha === qtdeClientesSubcampanha) {
                                    setIdSubcampanha("");
                                  }
                                  setCampanhaData({
                                    qtde_clientes: qtdeClientesSubcampanha,
                                    qtde_all_clientes: qtde_all_clientes_subcampanha,
                                  });
                                  deleteClientesSubcampanhaLote({
                                    id_campanha: data_subcampanha.id || "",
                                    filters: filters_lote,
                                  });
                                }}
                                headerTitle="Remover Clientes"
                                description={`Digite "${String(data_subcampanha?.nome)
                                  .trim()
                                  .toUpperCase()
                                  .replaceAll(
                                    "  ",
                                    " "
                                  )}" para poder remover os clientes desta subcampanha`}
                                placeholder={data_subcampanha?.nome?.trim().toUpperCase()}
                                disabled={disabledSubcampanha}
                                equalText
                              >
                                {deleteClientesSubcampanhaLoteIsPending ? (
                                  <>
                                    <FaSpinner size={18} className="me-2 animate-spin" />
                                    Removendo...
                                  </>
                                ) : (
                                  <>
                                    <X className="me-2" size={18} /> Remover Clientes
                                  </>
                                )}
                              </ButtonMotivation>
                              <ButtonMotivation
                                title="Exclui a subcampanha e retorna os clintes para fora dela..."
                                variant={"destructive"}
                                action={() => {
                                  setIdSubcampanha("");
                                  deleteSubcampanha(data_subcampanha.id);
                                }}
                                headerTitle="Excluir subcampanha"
                                description={`Digite "${String(data_subcampanha?.nome)
                                  .trim()
                                  .toUpperCase()}" para poder excluir a subcampanha`}
                                placeholder={data_subcampanha?.nome?.trim().toUpperCase()}
                                disabled={disabledSubcampanha}
                                equalText
                              >
                                {deleteSubcampanhaIsPending ? (
                                  <>
                                    <FaSpinner size={18} className="me-2 animate-spin" />
                                    Excluindo...
                                  </>
                                ) : (
                                  <>
                                    <Trash className="me-2" size={18} /> Excluir Subcampanha
                                  </>
                                )}
                              </ButtonMotivation>
                            </>
                          )}
                          <ButtonExportSubcampanhas disabled={disabledSubcampanha} />
                          {canEdit && (
                            <>
                              <Button
                                variant={"warning"}
                                onClick={() => openModalDefinirAparelho(qtdeClientesSubcampanha)}
                                disabled={disabledSubcampanha}
                              >
                                <Smartphone className="me-2" size={18} /> Definir Aparelhos
                              </Button>
                              <Button
                                variant={"tertiary"}
                                onClick={() => openModalDefinirVendedores(qtdeClientesSubcampanha)}
                                disabled={disabledSubcampanha}
                              >
                                <UserPen className="me-2" size={18} /> Definir Vendedores
                              </Button>
                            </>
                          )}
                        </span>
                      </span>
                      <div className="overflow-auto bg-background rounded-lg">
                        <DataTable
                          pagination={paginationSubcampanha}
                          setPagination={setPaginationSubcampanha}
                          data={clientesSubcampanha}
                          rowCount={rowCountSubcampanha}
                          columns={columnsTableClientesSubcampanha}
                          isLoading={isLoadingSubcampanha || isFetchingSubcampanha}
                          variant="secondary"
                          fixed
                          maxHeight={50}
                        />
                      </div>
                      <span className="flex justify-end">
                        <Badge variant={"secondary"}>
                          Quantidade Total de Clientes: {qtdeClientesSubcampanha}
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
        <ModalNovaSubcampanha refetch={refetch} />
        <ModalEditarCliente />
        <ModalVerCliente />
        <ModalDefinirAparelho reset={handleResetFilterSubcampanha} />
        <ModalDefinirVendedores />
        <ModalDuplicarCampanha refetch={refetch} />

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
