import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";

import { InputDate } from "@/components/custom/InputDate";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { useEffect, useState } from "react";
import { useStoreEditarRecorrencias } from "./store";

export type EditRecorrenciaProps = {
  id: string | number;
  data_vencimento: Date;
};

const ModalEditarRecorrencias = () => {
  const [dataVencimento, setDataVencimento] = useState<Date | undefined>();
  const modalOpen = useStoreEditarRecorrencias().modalOpen;
  const closeModal = useStoreEditarRecorrencias().closeModal;
  const id = useStoreEditarRecorrencias().id;

  const { mutate: changeRecorrencia } = useTituloPagar().changeRecorrencia();

  function editarRecorrencia() {
    if (dataVencimento) {
      const data: EditRecorrenciaProps = {
        id: id || "",
        data_vencimento: dataVencimento,
      };
      changeRecorrencia(data);
      closeModal();
    } else {
      toast({
        title: "Dados insuficientes",
        description: "Você não selecionou a nova data de vencimento",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    if (!modalOpen) {
      setDataVencimento(undefined);
    }
  }, [modalOpen]);

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="mb-2">Editar Recorência: {id}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && (
            <div className="flex flex-col w-full">
              <label className="text-sm font-medium">Data de Vencimento</label>
              <InputDate
                className="mt-2 w-full"
                value={dataVencimento}
                onChange={(e: Date) => setDataVencimento(e)}
              />
            </div>
          )}
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => editarRecorrencia()}>Editar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEditarRecorrencias;
