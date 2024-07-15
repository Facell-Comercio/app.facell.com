import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { InputDate } from "@/components/custom/InputDate";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useVencimentos } from "@/hooks/financeiro/useVencimentos";
import { useEffect, useState } from "react";
import { useStoreTableVencimentos } from "../tables/store";

export type AlteracaoLoteVencimentosSchemaProps = {
  value?: Date;
  ids: number[];
};

const ModalAlteracoesVencimentosLote = () => {
  const [data, setData] = useState<Date | undefined>(undefined);
  const modalOpen = useStoreTableVencimentos().modalOpen;
  const closeModal = useStoreTableVencimentos().closeModal;
  const idSelection = useStoreTableVencimentos().idSelection;
  const handleRowSelection = useStoreTableVencimentos().handleRowSelection;

  const { mutate: changeVencimento } = useVencimentos().changeVencimentos();

  const alterarLote = async () => {
    if (!data) {
      toast({
        variant: "destructive",
        title: "Dados insuficientes!",
        description: "Selecione o tipo da alteração e seu valor",
      });
      return;
    }
    changeVencimento({
      value: data,
      ids: idSelection,
    });
    handleRowSelection({ idSelection: [], rowSelection: {} });
    closeModal();
  };

  useEffect(() => {
    if (!modalOpen) {
      setData(undefined);
    }
  }, [modalOpen]);

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle className="mb-2">Alteração em Lote</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Previsão de Pagamento</label>
          <InputDate
            className="mt-2"
            value={data}
            onChange={(e: Date) => setData(e)}
          />
        </div>
        <DialogFooter>
          <Button onClick={() => alterarLote()}>Alterar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAlteracoesVencimentosLote;
