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
import { DialogDescription } from "@radix-ui/react-dialog";
import { Ban, Save } from "lucide-react";
import { useState } from "react";
import { useStoreCampanha } from "../store";

const ModalNovaSubcampanha = () => {
  const [qtde_clientes, modalOpen, closeModal] = useStoreCampanha((state) => [
    state.qtde_clientes,
    state.modalNovaSubcampanhaOpen,
    state.closeModalNovaSubcampanha,
  ]);

  const [nomeSubcampanha, setNomeSubcampanha] = useState("");

  function handleClickCancel() {
    closeModal();
  }
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
          <Button variant={"secondary"} onClick={handleClickCancel}>
            <Ban size={18} className="me-2" />
            Fechar
          </Button>
          <Button onClick={() => console.log("SALVANDO")}>
            <Save size={18} className="me-2" />
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalNovaSubcampanha;
