import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrcamento } from "@/hooks/financeiro/useOrcamento";
import { ArrowDownUp } from "lucide-react";
import { useRef } from "react";
import { FaRegCircleXmark } from "react-icons/fa6";
import FormMeuOrcamento from "./Form";
import { MeuOrcamentoSchema } from "./form-data";
import { useStoreMeuOrcamento } from "./store";

const ModalMeuOrcamento = () => {
  const modalOpen = useStoreMeuOrcamento().modalOpen;
  const closeModal = useStoreMeuOrcamento().closeModal;
  const id = useStoreMeuOrcamento().id;
  const formRef = useRef(null);

  const { data, isLoading } = useOrcamento().getMyBudget(id);

  const newData: MeuOrcamentoSchema = {
    id_conta_saida: data?.data?.id_conta_saida,
    conta_saida: data?.data?.conta_saida,
    disponivel: data?.data?.disponivel,
    id_conta_entrada: "",
    conta_entrada: "",
    valor_transferido: "",

    id_grupo_economico: data?.data?.id_grupo_economico?.toString(),
    id_orcamento: data?.data?.id_orcamento,
    id_centro_custo_saida: data?.data?.id_centro_custo?.toString(),
    centro_custo_entrada: data?.data?.centro_custo_entrada?.toString(),
    centro_custo_saida: data?.data?.centro_custo_entrada?.toString(),
    id_centro_custo_entrada: data?.data?.id_centro_custo?.toString(),
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
        <DialogFooter className="flex gap-2 items-end flex-wrap">
          <Button onClick={() => closeModal()} variant={"secondary"}>
            <FaRegCircleXmark className="me-2 text-xl" />
            Cancelar
          </Button>
          <Button
            type="submit"
            className="dark:text-white"
            onClick={() => handleClickTransfer(formRef)}
          >
            <ArrowDownUp className="me-2" />
            Transferir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalMeuOrcamento;
