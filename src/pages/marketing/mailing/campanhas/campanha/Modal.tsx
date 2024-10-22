import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
import { Plus, SlidersHorizontal, Smartphone, UserPen, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ClienteProps, columnsTableClientes } from "./components/columns-clientes";
import { columnsTableClientesSubcampanha } from "./components/columns-clientes-campanha";
import ModalDefinirAparelho from "./components/ModalDefinirAparelho";
import ModalDefinirVendedores from "./components/ModalDefinirVendedores";
import ModalEditarCliente from "./components/ModalEditarCliente";
import ModalNovaSubcampanha from "./components/ModalNovaSubcampanha";
import ModalVerCliente from "./components/ModalVerCliente";
import { useStoreCampanha } from "./store";

const ModalCampanha = () => {
  const [
    id,
    modalOpen,
    closeModal,

    openModalNovaSubcampanha,
    openModalDefinirAparelho,
    openModalDefinirVendedores,

    setFiltersLote,

    filters,
    filters_lote,
  ] = useStoreCampanha((state) => [
    state.id,
    state.modalOpen,
    state.closeModal,

    state.openModalNovaSubcampanha,
    state.openModalDefinirAparelho,
    state.openModalDefinirVendedores,

    state.setFiltersLote,

    state.filters,
    state.filters_lote,
  ]);
  const [idSubcampanha, setIdSubcampanha] = useState<string | undefined>();

  function handleClickCancel() {
    closeModal();
  }
  const { data, isFetched, isSuccess, isLoading } = useMailing().getOneCampanha({ id, filters });
  const { data: data_subcampanha, isLoading: isLoadingSubcampanha } = useMailing().getOneCampanha({
    id: idSubcampanha,
    filters: filters_lote,
  });
  const subcampanhas = data?.subcampanhas || [];
  const defaultIdSubcampanha = subcampanhas && subcampanhas[0] && subcampanhas[0].id;

  useEffect(() => {
    setIdSubcampanha(defaultIdSubcampanha);
    setFiltersLote({ id_campanha: defaultIdSubcampanha || "" });
  }, [isFetched, isSuccess]);
  const [itemOpen, setItemOpen] = useState<string>("clientes");

  if (!data) {
    return null;
  }

  const clientes: ClienteProps[] = data?.clientes || [];
  const clientesSubcampanha: ClienteProps[] = data_subcampanha?.clientes || [];
  return (
    <Dialog open={modalOpen} onOpenChange={() => handleClickCancel()}>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>Campanha: {data?.nome}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex flex-col gap-3 max-h-[70vh]">
          <div className="grid gap-3 w-full overflow-auto scroll-thin p-3 bg-slate-200 dark:bg-blue-950">
            <Accordion
              type="single"
              collapsible
              value={itemOpen}
              onValueChange={(e) => setItemOpen(e)}
              className="border rounded-md bg-background"
            >
              <AccordionItem value="clientes" className="border-0">
                <AccordionTrigger className="p-3 border-0 rounded-md py-1 hover:no-underline">
                  Clientes
                </AccordionTrigger>
                <AccordionContent className="flex gap-2 flex-col p-2">
                  <span className="flex items-center w-full justify-between">
                    <Button variant={"secondary"}>
                      <SlidersHorizontal className="me-2" size={18} />
                      Filtro
                    </Button>
                    <Button onClick={() => openModalNovaSubcampanha(data?.qtde_clientes)}>
                      <Plus className="me-2" size={18} /> Nova Subcampanha
                    </Button>
                  </span>
                  <div className="grid bg-background rounded-lg ">
                    <DataVirtualTableHeaderFixed
                      // @ts-ignore
                      columns={columnsTableClientes}
                      data={clientes}
                      className={`h-[300px] border`}
                      isLoading={isLoading}
                    />
                  </div>
                  <span className="flex justify-end">
                    <Badge variant={"secondary"}>
                      Quantidade de Clientes: {data?.qtde_clientes}
                    </Badge>
                  </span>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Tabs defaultValue={defaultIdSubcampanha} className="w-full">
              <TabsList
                className={`w-full justify-start flex h-auto bg-background ${
                  !idSubcampanha && "hidden"
                }`}
              >
                <ScrollArea className="w-fill whitespace-nowrap rounded-md h-auto">
                  {subcampanhas?.map((subcampanha: any) => (
                    <TabsTrigger
                      className={"data-[state=active]:bg-secondary"}
                      value={subcampanha?.id}
                      onClick={() => {
                        setIdSubcampanha(subcampanha.id);
                        setFiltersLote({ id_campanha: subcampanha?.id || "" });
                      }}
                      key={`${subcampanha.id} - ${subcampanha.nome}`}
                    >
                      {subcampanha?.nome}
                    </TabsTrigger>
                  ))}
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </TabsList>
              {subcampanhas?.map((subcampanha: any) => (
                <TabsContent
                  value={subcampanha?.id}
                  key={`${subcampanha.id} - ${subcampanha.nome}`}
                >
                  <div className="flex flex-col gap-2 bg-background rounded-md w-full p-2">
                    <span className="flex items-center w-full justify-between">
                      <Button variant={"secondary"}>
                        <SlidersHorizontal className="me-2" size={18} />
                        Filtro
                      </Button>
                      <span className="flex  gap-2">
                        <Button
                          variant={"warning"}
                          onClick={() => openModalDefinirAparelho(data_subcampanha?.qtde_clientes)}
                        >
                          <Smartphone className="me-2" size={18} /> Definir Aparelhos
                        </Button>
                        <Button
                          variant={"tertiary"}
                          onClick={() =>
                            openModalDefinirVendedores(data_subcampanha?.qtde_clientes)
                          }
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
                        isLoading={isLoadingSubcampanha}
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
          </div>
        </ScrollArea>

        {/* Modais */}
        <ModalNovaSubcampanha />
        <ModalEditarCliente />
        <ModalVerCliente />
        <ModalDefinirAparelho />
        <ModalDefinirVendedores />

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
