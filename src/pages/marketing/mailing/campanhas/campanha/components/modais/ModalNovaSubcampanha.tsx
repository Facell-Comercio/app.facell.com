import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { InputWithLabel } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { useMailing } from "@/hooks/marketing/useMailing";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Ban, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { useStoreCampanha } from "../../store";

const ModalNovaSubcampanha = ({ refetch }: { refetch: () => void }) => {
  const [id, qtde_clientes, modalOpen, closeModal, filters, isPending, setIsPending, resetFilters] =
    useStoreCampanha((state) => [
      state.id,
      state.qtde_clientes,
      state.modalNovaSubcampanhaOpen,
      state.closeModalNovaSubcampanha,
      state.filters,
      state.isPending,
      state.setIsPending,
      state.resetFilters,
    ]);
  const [nomeSubcampanha, setNomeSubcampanha] = useState("");

  const {
    mutate: insertOneSubcampanha,
    isPending: insertOneSubcampanhaIsPending,
    isSuccess: insertOneSubcampanhaSuccess,
    isError: insertOneSubcampanhaIsError,
  } = useMailing().insertOneSubcampanha();
  useEffect(() => {
    if (insertOneSubcampanhaIsPending) {
      setIsPending(true);
    }
    if (insertOneSubcampanhaSuccess) {
      closeModal();
      setIsPending(false);
    }
    if (insertOneSubcampanhaIsError) {
      setIsPending(false);
    }
  }, [insertOneSubcampanhaIsPending]);

  function handleClickCancel() {
    closeModal();
  }
  async function handleSubmit() {
    if (nomeSubcampanha.length < 5 || nomeSubcampanha.length > 50) {
      toast({
        title: "Nome inválido para a subcampanha",
        description: "O nome deve ter no mínimo 5 caracteres e no máximo 50 caracteres",
        variant: "warning",
      });
      return;
    }
    insertOneSubcampanha({ nome: nomeSubcampanha, filters, id_parent: id || "" });
  }

  async function resetModal() {
    await new Promise((resolve) => resolve(resetFilters()));
    refetch();
    setNomeSubcampanha("");
  }
  useEffect(() => {
    if (insertOneSubcampanhaSuccess && nomeSubcampanha) {
      resetModal();
    }
  }, [insertOneSubcampanhaIsPending]);

  return (
    <Dialog open={modalOpen} onOpenChange={() => handleClickCancel()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Criar Nova Subcampanha:</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex p-1 gap-2 max-h-[70vh]">
          <div className="flex gap-3 p-1 w-full">
            <InputWithLabel
              label="Nome:"
              value={nomeSubcampanha}
              onChange={(e) => setNomeSubcampanha(e.target.value)}
              className="flex-1"
              inputClass="uppercase"
              placeholder="NOME DA SUBCAMPANHA"
            />
            <InputWithLabel
              label="Quantidade Total de Clientes:"
              value={qtde_clientes || ""}
              readOnly
              className="flex-1"
            />
          </div>
        </ScrollArea>
        <DialogFooter className="flex items-end flex-wrap">
          <Button variant={"secondary"} onClick={handleClickCancel} disabled={isPending}>
            <Ban size={18} className="me-2" />
            Fechar
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <FaSpinner size={18} className="me-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={18} className="me-2" />
                Salvar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalNovaSubcampanha;
