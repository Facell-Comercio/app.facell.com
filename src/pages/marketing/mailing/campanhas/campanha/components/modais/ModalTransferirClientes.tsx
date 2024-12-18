import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { CustomCombobox } from "@/components/custom/CustomCombobox";
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

const initialFormData = {
  nome: "",
  id: "",
};

const ModalTransferirClientes = ({
  refetch,
  idSubcampanha,
  subcampanhas,
}: {
  refetch: () => void;
  idSubcampanha: string | undefined;
  subcampanhas: any[];
}) => {
  const [
    id,
    qtde_clientes,
    modalOpen,
    closeModal,
    filters_lote,
    isPending,
    setIsPending,
    resetFiltersLote,
  ] = useStoreCampanha((state) => [
    state.id,
    state.qtde_clientes,
    state.modalTransferirClientesOpen,
    state.closeModalTransferirClientes,
    state.filters_lote,
    state.isPending,
    state.setIsPending,
    state.resetFiltersLote,
  ]);
  const [formData, setFormData] = useState(initialFormData);

  const {
    mutate: transferirClientesSubcampanha,
    isPending: transferirClientesSubcampanhaIsPending,
    isSuccess: transferirClientesSubcampanhaSuccess,
    isError: transferirClientesSubcampanhaIsError,
  } = useMailing().transferirClientesSubcampanha();
  useEffect(() => {
    if (transferirClientesSubcampanhaIsPending) {
      setIsPending(true);
    }
    if (transferirClientesSubcampanhaSuccess) {
      closeModal();
      setIsPending(false);
    }
    if (transferirClientesSubcampanhaIsError) {
      setIsPending(false);
    }
  }, [transferirClientesSubcampanhaIsPending]);

  function handleClickCancel() {
    closeModal();
  }
  async function handleSubmit() {
    if (formData.nome.length < 5 || formData.nome.length > 50) {
      toast({
        title: "Nome inválido para a subcampanha",
        description: "O nome deve ter no mínimo 5 caracteres e no máximo 50 caracteres",
        variant: "warning",
      });
      return;
    }
    const id_campanha = idSubcampanha;
    transferirClientesSubcampanha({
      nome: formData.nome,
      id_subcampanha: formData.id,
      filters: { ...filters_lote, id_campanha },
      id_parent: id || "",
    });
  }

  async function resetModal() {
    await new Promise((resolve) => resolve(resetFiltersLote()));
    refetch();
    setFormData(initialFormData);
  }
  useEffect(() => {
    if (transferirClientesSubcampanhaSuccess) {
      resetModal();
    }
  }, [transferirClientesSubcampanhaIsPending]);

  return (
    <Dialog open={modalOpen} onOpenChange={() => handleClickCancel()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Transferir Clientes:</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex p-1 gap-2 max-h-[70vh]">
          <div className="flex gap-3 p-1 w-full">
            <span className={`flex flex-col gap-2 `}>
              <label className="text-sm font-medium">Nome:</label>
              <CustomCombobox
                hasCustomValue
                className="min-w-[38ch] w-full"
                value={formData.nome}
                disabled={isPending}
                onChange={(nome) => {
                  setFormData({
                    nome,
                    id: subcampanhas.filter((val) => val.nome == nome)[0]?.id || "",
                  });
                }}
                defaultValues={subcampanhas.map((subcampanha) => ({
                  value: subcampanha.nome,
                  label: subcampanha.nome,
                }))}
                placeholder="Selecione a subcampanha..."
              />
            </span>
            <InputWithLabel
              label="Quantidade Total de Clientes:"
              value={qtde_clientes || ""}
              readOnly
              disabled={isPending}
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

export default ModalTransferirClientes;
