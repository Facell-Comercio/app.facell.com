import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { useEffect, useState } from "react";
import { useStoreTablePagar } from "../table/store-table";
import { useStoreTitulo } from "../titulo/store";

type AlteracaoLoteProps = {
  type?: string;
  data_prevista?: Date;
  status?: string;
};

export type AlteracaoLoteSchemaProps = {
  type: string;
  value: string | Date;
  ids: number[];
};

const ModalAlteracoesLote = () => {
  const [data, setData] = useState<AlteracaoLoteProps>({
    type: "status",
    // data_prevista: undefined,
    status: "",
  });
  const modalOpen = useStoreTitulo().modalAlteracaoLoteOpen;
  const closeModal = useStoreTitulo().closeAlteracaoLoteModal;
  const idSelection = useStoreTablePagar().idSelection;

  const { mutate: changeTitulos } = useTituloPagar().changeTitulos();

  const alterarLote = async () => {

    if (idSelection.length === 0) {
      toast({
        variant: "destructive",
        title: "Solicitações não selecionadas",
        description:
          "Selecione uma ou mais solicitações para realizar as alterações",
      });
    } else if (data.type === "status" && data.status) {
      changeTitulos({ type: data.type, value: data.status, ids: idSelection });
      closeModal();
    } else {
      toast({
        variant: "destructive",
        title: "Dados insuficientes!",
        description: "Selecione o status desejado",
      });
    }
  };

  useEffect(() => {
    if (!modalOpen) {
      setData({
        type: "status",
        data_prevista: undefined,
        status: "",
      });
    }
  }, [modalOpen]);

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="mb-2">Alteração em Lote</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && (
            <div className="flex gap-3 p-1">
              <div className="flex-1">
                <label className="text-sm font-medium">
                  Status da Solicitação
                </label>
                <Select
                  value={data.status}
                  onValueChange={(value) => setData({ ...data, status: value })}
                >
                  <SelectTrigger className="flex-1 mt-2">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="1">Solicitado</SelectItem>
                      <SelectItem value="3">Aprovado</SelectItem>
                      <SelectItem value="2">Negado</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => alterarLote()}>Alterar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAlteracoesLote;
