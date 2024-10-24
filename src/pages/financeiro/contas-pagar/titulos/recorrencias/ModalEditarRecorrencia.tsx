import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/custom/FormInput";
import { InputDate } from "@/components/custom/InputDate";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { useEffect, useState } from "react";
import { TbCurrencyReal } from "react-icons/tb";
import { useStoreRecorrencias } from "./store";

export type EditRecorrenciaProps = {
  id: string | number;
  data_vencimento?: Date;
  valor?: number;
};

export type EditRecorrenciaDataProps = {
  data_vencimento?: Date;
  valor?: number;
};

const ModalEditarRecorrencia = () => {
  const [modalOpen, closeModal, id, data_vencimento, valor] =
    useStoreRecorrencias((state) => [
      state.modalEditRecorrenciaOpen,
      state.closeModalEditRecorrencia,
      state.id,
      state.data_vencimento,
      state.valor,
    ]);

  const initialPropsRecorrencia = {
    data_vencimento: data_vencimento,
    valor: valor,
  };
  const [data, setData] = useState<EditRecorrenciaDataProps>(
    initialPropsRecorrencia
  );

  const { mutate: changeRecorrencia } = useTituloPagar().changeRecorrencia();

  function editarRecorrencia() {
    if (
      initialPropsRecorrencia.data_vencimento !== undefined ||
      initialPropsRecorrencia.valor !== undefined
    ) {
      const objBody: EditRecorrenciaProps = {
        id: id || "",
        data_vencimento:
          data.data_vencimento || initialPropsRecorrencia.data_vencimento,
        valor: data.valor || initialPropsRecorrencia.valor,
      };
      changeRecorrencia(objBody);
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
      setData(initialPropsRecorrencia);
    }
  }, [modalOpen]);
  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="mb-2">Editar Recorência: {id}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <section className="flex gap-2 w-full">
            <div className="flex flex-col flex-1">
              <label className="text-sm font-medium">Data de Vencimento</label>
              <InputDate
                className="mt-2"
                value={
                  data.data_vencimento ||
                  initialPropsRecorrencia.data_vencimento
                }
                onChange={(e: Date) => setData({ ...data, data_vencimento: e })}
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-sm font-medium">Valor</label>
              <div className="flex itens-center justify-center mt-2">
                <Button
                  type={"button"}
                  variant={"secondary"}
                  disabled={true}
                  className={`flex items-center justify-center rounded-none p-2 rounded-l-md `}
                >
                  <TbCurrencyReal size={18} />
                </Button>
                <Input
                  type="number"
                  className="rounded-none rounded-r-md"
                  value={data.valor || initialPropsRecorrencia.valor}
                  onChange={(e) =>
                    setData({ ...data, valor: parseFloat(e.target.value) })
                  }
                />
              </div>
            </div>
          </section>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => editarRecorrencia()}>Editar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEditarRecorrencia;
