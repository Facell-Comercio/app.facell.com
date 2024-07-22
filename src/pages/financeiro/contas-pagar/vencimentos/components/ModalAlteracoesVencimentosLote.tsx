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
import { VencimentosProps } from "@/pages/financeiro/components/ModalFindItemsBordero";
import { useEffect, useState } from "react";
import { useStoreTableVencimentos } from "../tables/store";

export type AlteracaoLoteVencimentosSchemaProps = {
  value?: Date;
  itens: VencimentosProps[];
};

type ModalAlteracoesVencimentosLoteProps = {
  itens: VencimentosProps[] | [];
};

const ModalAlteracoesVencimentosLote = ({
  itens,
}: ModalAlteracoesVencimentosLoteProps) => {
  const [dataPrevista, setDataPrevista] = useState<Date | undefined>(undefined);
  const modalOpen = useStoreTableVencimentos().modalOpen;
  const closeModal = useStoreTableVencimentos().closeModal;
  const rowSelection = useStoreTableVencimentos().rowSelection;
  const handleRowSelection = useStoreTableVencimentos().handleRowSelection;

  const { mutate: changeVencimento } = useVencimentos().changeVencimentos();

  const alterarLote = async () => {
    const selectedIndexes = Object.keys(rowSelection)
      .filter((key: any) => rowSelection[key])
      .map(Number);

    const itensSelecionados =
      itens.filter((_, index) => selectedIndexes.includes(index)) || [];

    if (!dataPrevista) {
      toast({
        variant: "destructive",
        title: "Dados insuficientes!",
        description: "Selecione o tipo da alteração e seu valor",
      });
      return;
    }
    changeVencimento({
      value: dataPrevista,
      itens: itensSelecionados,
    });
    handleRowSelection({ rowSelection: {} });
    closeModal();
  };

  useEffect(() => {
    if (!modalOpen) {
      setDataPrevista(undefined);
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
            value={dataPrevista}
            onChange={(e: Date) => setDataPrevista(e)}
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
