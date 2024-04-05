import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrcamento } from "@/hooks/useOrcamento";
import { useRef } from "react";
import { Button } from "react-day-picker";
import FormMeuOrcamento from "./Form";
import { MeuOrcamentoSchema } from "./form-data";
import { useStoreMeuOrcamento } from "./store";

const ModalMeuOrcamento = () => {
  const modalOpen = useStoreMeuOrcamento().modalOpen;
  const closeModal = useStoreMeuOrcamento().closeModal;
  const id = useStoreMeuOrcamento().id;
  const formRef = useRef(null);

  const { data, isLoading } = useOrcamento().getOne(id);

  const newData: MeuOrcamentoSchema = {
    id_conta_saida: data?.data.id_conta_saida,
    disponivel: data?.data.saldo.toFixed(2),
    id_conta_entrada: "",
    valor_transferido: "",
  };

  function handleClickTransfer(
    ref: React.MutableRefObject<HTMLFormElement | null>
  ) {
    ref.current && ref.current.requestSubmit();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={() => closeModal()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transferência de Saldo Entre Contas</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <FormMeuOrcamento id={id} data={newData} formRef={formRef} />
          ) : (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )}
        </ScrollArea>
        <DialogFooter className="flex items-end">
          <Button onClick={() => closeModal()}>Cancelar</Button>
          <Button onClick={() => handleClickTransfer(formRef)}>
            Transferir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalMeuOrcamento;
