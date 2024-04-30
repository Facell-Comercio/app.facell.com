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
import { useEffect, useState } from "react";
import { useStoreTablePagar } from "../table/store-table";
import { useStoreAlteracoesLote } from "./store";

type AlteracaoLoteProps = {
  type?: string;
  vencimento?: Date;
  status?: string;
};

const ModalAlteracoesLote = () => {
  const [data, setData] = useState<AlteracaoLoteProps>({
    type: "",
    vencimento: undefined,
    status: "",
  });

  const modalOpen = useStoreAlteracoesLote().modalOpen;

  const closeModal = useStoreAlteracoesLote().closeModal;
  // const queryClient = useQueryClient();
  const idSelection = useStoreTablePagar().idSelection;

  const alterarLote = async () => {
    if (data.type === "vencimento" && data.vencimento) {
      console.log(data.type, data.vencimento);
      console.log(idSelection);
    } else if (data.type === "status" && data.status) {
      console.log(data.type, data.status);
      console.log(idSelection);
    } else {
      toast({
        title: "Dados insuficientes!",
        description: "Selecione o tipo da alteração e seu valor",
      });
    }
  };

  useEffect(() => {
    if (!modalOpen) {
      setData({
        type: "",
        vencimento: undefined,
        status: "",
      });
    }
  }, [modalOpen]);

  function valorAlterado() {
    if (data.type == "vencimento") {
      return (
        <div className="flex-1">
          <label className="text-sm font-medium">Data de Vencimento</label>
          <InputDate
            className="mt-2 flex-1"
            value={data.vencimento}
            onChange={(e: Date) => setData({ ...data, vencimento: e })}
          />
        </div>
      );
    } else if (data.type == "status") {
      return (
        <div className="flex-1">
          <label className="text-sm font-medium">Status da Solicitação</label>
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
                <SelectItem value="2">Aprovado</SelectItem>
                <SelectItem value="3">Negado</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      );
    }
  }

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
                <label className="text-sm font-medium">Tipo de Alteração</label>
                <Select
                  onValueChange={(value) => setData({ ...data, type: value })}
                >
                  <SelectTrigger className="flex-1 mt-2">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="vencimento">
                        Data de Vencimento
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {valorAlterado()}
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
