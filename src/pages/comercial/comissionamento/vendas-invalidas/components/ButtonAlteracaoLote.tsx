import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVendasInvalidadas } from "@/hooks/comercial/useVendasInvalidadas";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { status_list } from "../table/Filters";
import { useStoreTableVendasInvalidadas } from "../table/store-table";

const ButtonAlteracaoLote = () => {
  const openModalAlteracoesLote = useStoreTableVendasInvalidadas().openModalAlteracaoLote;

  return (
    <>
      <Button
        variant={"outline"}
        className="border border-warning"
        onClick={() => openModalAlteracoesLote()}
      >
        <Edit className="me-2" size={18} /> Alterar em lote
      </Button>
      <ModalAlteracoesLote />
    </>
  );
};

export type AlteracaoLoteSchemaProps = {
  type: string;
  value: string | Date;
  ids: number[];
};

const ModalAlteracoesLote = () => {
  const [status, setStatus] = useState("");
  const [modalOpen, closeModal, filters, mes, ano] = useStoreTableVendasInvalidadas((state) => [
    state.modalAlteracaoLoteOpen,
    state.closeModalAlteracaoLote,
    state.filters,
    state.mes,
    state.ano,
  ]);

  const { mutate: udpateLote } = useVendasInvalidadas().updateLote();

  const alterarLote = async () => {
    udpateLote({ status, filters: { ...filters, mes, ano } });
    closeModal();
  };

  useEffect(() => {
    if (!modalOpen) {
      setStatus("");
    }
  }, [modalOpen]);

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="mb-2">Alteração em Lote</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && (
            <div className="flex gap-3 p-1">
              <div className="flex-1">
                <label className="text-sm font-medium">Status da Venda</label>
                <Select value={status} onValueChange={(value) => setStatus(value)}>
                  <SelectTrigger className="flex-1 mt-2">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {status_list.map((status) => {
                        return (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => alterarLote()}>Alterar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ButtonAlteracaoLote;
