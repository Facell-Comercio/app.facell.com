import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { InputWithLabel } from "@/components/custom/FormInput";
import { InputDate } from "@/components/custom/InputDate";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { useMailing } from "@/hooks/marketing/useMailing";
import { NovaCampanhaSchema } from "@/pages/marketing/mailing/clientes/nova-campanha/form-data";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Ban, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { useStoreCampanha } from "../../store";

const ModalDuplicarCampanha = () => {
  const [id, qtde_clientes, modalOpen, closeModal, filters, isPending, setIsPending, resetFilters] =
    useStoreCampanha((state) => [
      state.id,
      state.qtde_clientes,
      state.modalDuplicarCampanhaOpen,
      state.closeModalDuplicarCampanha,
      state.filters,
      state.isPending,
      state.setIsPending,
      state.resetFilters,
    ]);

  const {
    mutate: duplicateCampanha,
    isPending: duplicateCampanhaIsPending,
    isSuccess: duplicateCampanhaSuccess,
    isError: duplicateCampanhaIsError,
  } = useMailing().duplicateCampanha();
  useEffect(() => {
    if (duplicateCampanhaIsPending) {
      setIsPending(true);
    }
    if (duplicateCampanhaSuccess) {
      closeModal();
      setIsPending(false);
    }
    if (duplicateCampanhaIsError) {
      setIsPending(false);
    }
  }, [duplicateCampanhaIsPending]);
  useEffect(() => {});
  function handleClickCancel() {
    closeModal();
  }
  const [formData, setFormData] = useState<NovaCampanhaSchema>({
    nome: "",
    data_inicio: undefined,
  });
  async function handleSubmit() {
    const nome = (formData && formData.nome) || "";
    if (nome.length < 5 || nome.length > 50) {
      toast({
        title: "Nome inválido para a subcampanha",
        description: "O nome deve ter no mínimo 5 caracteres e no máximo 50 caracteres",
        variant: "warning",
      });
      return;
    }
    if (!formData.data_inicio) {
      toast({
        title: "Data de início inválida",
        description: "Por favor, preencha a data de início",
        variant: "warning",
      });
      return;
    }

    duplicateCampanha({ ...formData, filters, id_campanha: id || "" });
  }

  useEffect(() => {
    if (duplicateCampanhaSuccess) {
      resetFilters();
    }
  }, [duplicateCampanhaIsPending]);

  return (
    <Dialog open={modalOpen} onOpenChange={() => handleClickCancel()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Duplicar Campanha:</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex p-1 gap-2 max-h-[70vh]">
          <div className="flex flex-wrap gap-3 p-1 w-full items-end">
            <InputWithLabel
              label="Nome:"
              value={formData.nome || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
              className="flex-1 min-w-full"
              inputClass="uppercase"
              placeholder="NOME DA CAMPANHA"
            />
            <span className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-medium">Data de Início:</label>
              <InputDate
                value={formData.data_inicio}
                onChange={(date) => setFormData((prev) => ({ ...prev, data_inicio: date }))}
                className="w-full"
              />
            </span>
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
          {/* <AlertPopUp
            title="Realmente deseja duplicar essa campanha?"
            description="Os clientes filtrados nela serão duplicados e adicionados em uma nova campanha"
            action={handleSubmit}
          > */}
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
          {/* </AlertPopUp> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDuplicarCampanha;
