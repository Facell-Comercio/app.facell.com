import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { DataVirtualTableHeaderFixed } from "@/components/custom/DataVirtualTableHeaderFixed";
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
  ] = useStoreCampanha((state) => [
    state.id,
    state.modalOpen,
    state.closeModal,

    state.openModalNovaSubcampanha,
    state.openModalDefinirAparelho,
    state.openModalDefinirVendedores,

    state.setFiltersLote,
  ]);
  const [idSubcampanha, setIdSubcampanha] = useState<string | undefined>();

  function handleClickCancel() {
    closeModal();
  }
  const { data, isFetched, isSuccess, isLoading } = useMailing().getOneCampanha(id);
  const { data: data_subcampanha, isLoading: isLoadingSubcampanha } =
    useMailing().getOneCampanha(idSubcampanha);
  const subcampanhas = data?.subcampanhas || [];
  const defaultIdSubcampanha = subcampanhas && subcampanhas[0] && subcampanhas[0].id;

  useEffect(() => {
    setIdSubcampanha(defaultIdSubcampanha);
    setFiltersLote({ id_campanha: defaultIdSubcampanha || "" });
  }, [isFetched, isSuccess]);

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
              {/* Permitir minimizar a tabela */}
              <DataVirtualTableHeaderFixed
                // @ts-ignore
                columns={columnsTableClientes}
                data={clientes}
                className={`h-[300px] border`}
                isLoading={isLoading}
              />
            </div>
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
                        setFiltersLote({ id_campanha: id || "" });
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
                      {/* MOSTRAR A QUANTIDADE DE CLIENTES FILTRADOS */}
                      <DataVirtualTableHeaderFixed
                        // @ts-ignore
                        columns={columnsTableClientesSubcampanha}
                        data={clientesSubcampanha}
                        className={`h-[300px] border`}
                        isLoading={isLoadingSubcampanha}
                      />
                    </div>
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
