import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";

import { ScrollArea } from "@radix-ui/react-scroll-area";

import AlertPopUp from "@/components/custom/AlertPopUp";
import SelectMes from "@/components/custom/SelectMes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useCartoes } from "@/hooks/financeiro/useCartoes";
import { useEffect, useState } from "react";
import { calcularDataPrevisaoPagamento } from "../../titulos/titulo/helpers/helper";
import { useStoreCartao } from "./store";

interface ModalTransferProps {
  id_cartao: string;
  id_fatura: string;
  ids: string[];
  dia_vencimento: string;
}

function ModalTransfer({
  id_cartao,
  id_fatura,
  dia_vencimento,
  ids,
}: ModalTransferProps) {
  const {
    mutate: transferVencimentos,
    isPending: transferVencimentosIsPending,
    isError: transferVencimentosIsError,
    isSuccess: transferVencimentosIsSuccess,
  } = useCartoes().transferVencimentos();
  const [
    modalTransferOpen,
    closeModalTransfer,
    closeModalFatura,
    editModal,
    isPending,
    editIsPending,
  ] = useStoreCartao((state) => [
    state.modalTransferOpen,
    state.closeModalTransfer,
    state.closeModalFatura,
    state.editModal,
    state.isPending,
    state.editIsPending,
  ]);
  const [dadosTransferecia, setDadosTransferecia] = useState({
    mes: "",
    ano: "",
  });

  function onSubmitData() {
    const data_vencimento = new Date(
      parseInt(dadosTransferecia.ano),
      parseInt(dadosTransferecia.mes),
      parseInt(dia_vencimento || "")
    );
    if (
      dadosTransferecia.mes &&
      dadosTransferecia.ano &&
      data_vencimento &&
      ids.length > 0
    ) {
      transferVencimentos({
        ids,
        data_vencimento,
        data_prevista: calcularDataPrevisaoPagamento(data_vencimento),
        id_cartao: id_cartao || "",
        id_antiga_fatura: id_fatura,
      });
    } else {
      toast({
        title: "Dados Insuficientes",
        description: "Por favor selecione o mês e o ano da fatura",
        variant: "warning",
      });
    }
  }

  useEffect(() => {
    if (transferVencimentosIsSuccess) {
      editModal(false);
      closeModalTransfer();
      closeModalFatura();
      editIsPending(false);
    } else if (transferVencimentosIsError) {
      editIsPending(false);
    } else if (transferVencimentosIsPending) {
      editIsPending(true);
    }
  }, [transferVencimentosIsPending]);

  return (
    <div>
      <Dialog
        open={modalTransferOpen}
        onOpenChange={() => closeModalTransfer()}
      >
        <DialogContent className="max-w-xl">
          <ScrollArea className="flex flex-col gap-2 max-h-[80vh]">
            <div className="flex justify-between text-lg font-medium">
              <span>{`Tranferência de Vencimentos da Fatura`}</span>
            </div>
            <form className="flex flex-col gap-2 flex-wrap justify-between items-end h-full">
              <section className="w-full flex gap-2">
                <div className="flex-1 min-w-40">
                  <label className="text-sm font-medium mb-2">Mês</label>
                  <SelectMes
                    disabled={isPending}
                    value={dadosTransferecia.mes}
                    onValueChange={(mes) =>
                      setDadosTransferecia((prev) => ({ ...prev, mes }))
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2">Ano</label>
                  <Input
                    disabled={isPending}
                    type="number"
                    min={2023}
                    step={"1"}
                    className="flex-1"
                    value={dadosTransferecia.ano}
                    onChange={(e) =>
                      setDadosTransferecia((prev) => ({
                        ...prev,
                        ano: e.target.value,
                      }))
                    }
                  />
                </div>
              </section>
            </form>
          </ScrollArea>
          <DialogFooter className="flex gap-2 items-end flex-wrap">
            <AlertPopUp
              title={"Deseja realmente realizar essa tranferência?"}
              description="Os vencimentos selecionados serão transferidos para outra fatura."
              action={() => onSubmitData()}
            >
              <Button type="submit">Transferir</Button>
            </AlertPopUp>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ModalTransfer;
