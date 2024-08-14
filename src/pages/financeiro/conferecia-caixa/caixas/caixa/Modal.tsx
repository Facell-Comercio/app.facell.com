import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { normalizeDate } from "@/helpers/mask";
import {
  ConferenciasCaixaSchema,
  useConferenciasCaixa,
} from "@/hooks/financeiro/useConferenciasCaixa";
import { useRef } from "react";
import FormCaixa from "./Form";
import { useStoreCaixa } from "./store";

const initialPropsCaixa: ConferenciasCaixaSchema = {
  data: "",
  data_baixa_datasys: "",
  data_conferencia: "",
  divergente: "",
  id: "",
  id_filial: "",
  id_user_conferencia: "",
  ocorrencias: "",
  saldo_anterior: "",
  saldo_atual: "",
  status: "",
  valor_cartao: "",
  valor_cartao_real: "",
  valor_dinheiro: "",
  valor_pitzi: "",
  valor_pitzi_real: "",
  valor_pix: "",
  valor_pix_banco: "",
  valor_recarga: "",
  valor_recarga_real: "",
  valor_retiradas: "",
  valor_tradein: "",
  valor_tradein_disponivel: "",
  valor_tradein_utilizado: "",
};

const ModalCaixa = () => {
  const [modalOpen, closeModal, modalEditing, editModal, isPending, id] =
    useStoreCaixa((state) => [
      state.modalOpen,
      state.closeModal,
      state.modalEditing,
      state.editModal,
      state.isPending,
      state.id,
    ]);

  const formRef = useRef(null);

  const { data, isLoading } = useConferenciasCaixa().getOne(id);

  const newDataCaixa: ConferenciasCaixaSchema & Record<string, any> =
    {} as ConferenciasCaixaSchema & Record<string, any>;

  for (const key in data?.data) {
    if (typeof data?.data[key] === "number") {
      newDataCaixa[key] = String(data?.data[key]);
    } else if (data?.data[key] === null) {
      newDataCaixa[key] = "";
    } else {
      newDataCaixa[key] = data?.data[key];
    }
  }
  console.log(newDataCaixa);

  function handleClickCancel() {
    editModal(false);
    closeModal();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex gap-4">
            {id ? (
              <>
                <span>{`Caixa: ${id}`}</span>
                <span>{`Data: ${normalizeDate(
                  newDataCaixa?.data || ""
                )}`}</span>
                <span>{`Filial: ${newDataCaixa.filial}`}</span>
              </>
            ) : (
              "Nova Caixa"
            )}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <FormCaixa
              id={id}
              data={newDataCaixa.id ? newDataCaixa : initialPropsCaixa}
              formRef={formRef}
            />
          ) : (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )}
        </ScrollArea>
        <DialogFooter className="sm:justify-between">
          <span className="flex gap-3 ">
            <Button variant={"secondary"} size={"lg"}>
              Reimportar Datasys
            </Button>
            <Button variant={"secondary"} size={"lg"}>
              Conciliar C/ Bases
            </Button>
          </span>
          <Button size={"lg"}>Baixar Caixa</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCaixa;
