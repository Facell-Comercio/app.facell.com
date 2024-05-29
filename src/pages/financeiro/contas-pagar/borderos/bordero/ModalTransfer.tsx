import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";

import { ScrollArea } from "@radix-ui/react-scroll-area";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { Input } from "@/components/custom/FormInput";
import { InputDate } from "@/components/custom/InputDate";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useBordero } from "@/hooks/financeiro/useBordero";
import ModalContasBancarias, {
  ItemContaBancariaProps,
} from "@/pages/financeiro/components/ModalContasBancarias";
import { VencimentosProps } from "@/pages/financeiro/components/ModalVencimentosOLD";
import { useState } from "react";
import { useStoreBordero } from "./store";

interface ModalTransferProps {
  data: VencimentosProps[];
  id_matriz: string;
}

function ModalTransfer({ data, id_matriz }: ModalTransferProps) {
  const { mutate: transferVencimentos } = useBordero().transferVencimentos();

  const [contaBancaria, setContaBancaria] = useState("");
  const [idContaBancaria, setIdContaBancaria] = useState("");
  const [pagamento, setPagamento] = useState<Date>();
  const modalContasBancariasOpen = useStoreBordero().modalContasBancariasOpen;
  const modalTransferOpen = useStoreBordero().modalTransferOpen;
  const toggleModalTransfer = useStoreBordero().toggleModalTransfer;
  const toggleModalContasBancarias =
    useStoreBordero().toggleModalContasBancarias;
  const toggleModal = useStoreBordero().toggleModal;
  const id = useStoreBordero().id;

  function handleSelectionContaBancaria(item: ItemContaBancariaProps) {
    setContaBancaria(item.descricao);
    setIdContaBancaria(item.id);

    toggleModalContasBancarias();
  }

  function onSubmitData() {
    if (idContaBancaria && pagamento) {
      // console.log({
      //   id_conta_bancaria: idContaBancaria,
      //   date: pagamento,
      //   titulos: data.map((titulo) => {
      //     titulo.id_titulo, titulo.id_status;
      //   }),
      // });

      toggleModalTransfer();
      toggleModal();
      transferVencimentos({
        id_conta_bancaria: idContaBancaria,
        date: pagamento,
        vencimentos: data.map((vencimento) => {
          return {
            id_vencimento: vencimento.id_vencimento,
            id_status: vencimento.id_status,
          };
        }),
      });
    } else {
      toast({
        title: "Dados Insuficientes",
        description:
          "Por favor selecione a conta bancária e a data de pagamento",
      });
    }
  }

  return (
    <div>
      <Dialog
        open={modalTransferOpen}
        onOpenChange={() => toggleModalTransfer()}
      >
        <DialogContent className="max-w-xl">
          <ScrollArea className="flex flex-col gap-2 max-h-[80vh]">
            <div className="flex justify-between text-lg font-medium">
              <span>{`Tranferência de Títulos Borderô: ${id}`}</span>
            </div>
            <form className="flex flex-col gap-2 flex-wrap justify-between items-end h-full">
              <section className="w-full flex gap-2">
                <div className="flex-1 min-w-40">
                  <label className="text-sm font-medium">Conta Bancária</label>
                  <Input
                    className="mt-2"
                    value={contaBancaria}
                    placeholder="Selecione a conta"
                    required
                    readOnly
                    onClick={() => toggleModalContasBancarias()}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium">
                    Data de Pagamento
                  </label>
                  <InputDate
                    className="mt-2 flex-1"
                    value={pagamento}
                    onChange={(e: Date) => setPagamento(e)}
                  />
                </div>
              </section>
            </form>
          </ScrollArea>
          <DialogFooter className="flex gap-2 items-end flex-wrap">
            <AlertPopUp
              title={"Deseja realmente realizar essa tranferência de titulos?"}
              description="Os títulos desse borderô serão transferidos para o outro borderô."
              action={() => onSubmitData()}
            >
              <Button type="submit">Transferir</Button>
            </AlertPopUp>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ModalContasBancarias
        open={modalContasBancariasOpen}
        handleSelection={handleSelectionContaBancaria}
        onOpenChange={toggleModalContasBancarias}
        id_matriz={id_matriz || ""}
      />
    </div>
  );
}

export default ModalTransfer;
