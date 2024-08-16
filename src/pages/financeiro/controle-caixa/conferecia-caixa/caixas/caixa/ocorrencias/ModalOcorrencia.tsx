import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import FormDateInput from "@/components/custom/FormDate";
import FormInput from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/context/auth-store";
import {
  OcorrenciasProps,
  useConferenciasCaixa,
} from "@/hooks/financeiro/useConferenciasCaixa";
import { useRef } from "react";
import { TbAlertTriangle } from "react-icons/tb";
import { useFormOcorrenciaData } from "../form-data";
import { useStoreCaixa } from "../store";

const initialPropsOcorrencias: OcorrenciasProps = {
  id: "",
  data: "",
  user_criador: "",
  descricao: "",
};

const ModalOcorrencia = () => {
  const user = useAuthStore((state) => state.user);
  const [modalOpen, closeModal, id] = useStoreCaixa((state) => [
    state.modalOcorrenciaOpen,
    state.closeModalOcorrencia,
    state.id_ocorrencia,
    state.openModalOcorrencia,
    state.closeModalOcorrencia,
    state.editModalOcorrencia,
  ]);
  const formRef = useRef(null);

  const { data, isLoading } = useConferenciasCaixa().getOneOcorrencia(id);

  const newDataCaixa: OcorrenciasProps & Record<string, any> =
    {} as OcorrenciasProps & Record<string, any>;

  for (const key in data) {
    if (typeof data[key] === "number") {
      newDataCaixa[key] = String(data[key]);
    } else if (data[key] === null) {
      newDataCaixa[key] = "";
    } else {
      newDataCaixa[key] = data[key];
    }
  }

  const { form } = useFormOcorrenciaData(
    id ? newDataCaixa : { ...initialPropsOcorrencias, user_criador: user?.nome }
  );

  function onSubmitData(data: OcorrenciasProps) {
    // if (id) update(data);
    // if (!id) insertOne(data);
  }

  function handleClickCancel() {
    closeModal();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex gap-4">
            <TbAlertTriangle size={22} className="text-red-500" />
            {id ? `Ocorrência: ${id}` : "Ocorrência"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <Form {...form}>
              <form
                className="flex gap-2 flex-wrap"
                ref={formRef}
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit(onSubmitData)(e);
                }}
              >
                <FormDateInput
                  readOnly={!!id}
                  name="data"
                  label="Data"
                  control={form.control}
                  className="flex-1 min-w-[30ch]"
                />
                <FormInput
                  readOnly={!!id}
                  name="user_criador"
                  label="Usuário"
                  control={form.control}
                  className="flex-1 min-w-[30ch]"
                />
                <FormInput
                  className="flex-1 min-w-full shrink-0"
                  name="descricao"
                  readOnly={!!id}
                  label="Descrição"
                  control={form.control}
                />
              </form>
            </Form>
          ) : (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )}
          <ScrollBar />
        </ScrollArea>
        <DialogFooter>
          {id ? (
            <div></div>
          ) : (
            <div className="flex gap-2 justify-between">
              <Button variant={"secondary"} onClick={handleClickCancel}>
                Cancelar
              </Button>
              <Button>Salvar</Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalOcorrencia;
