import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AlertPopUp from "@/components/custom/AlertPopUp";
import FormDateInput from "@/components/custom/FormDate";
import FormInput from "@/components/custom/FormInput";
import FormTextarea from "@/components/custom/FormTextarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/context/auth-store";
import { OcorrenciasProps, useConferenciasCaixa } from "@/hooks/financeiro/useConferenciasCaixa";
import { startOfDay } from "date-fns";
import { ArrowLeftRight, Ban, Check, Copy, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TbAlertTriangle } from "react-icons/tb";
import { useFormOcorrenciaData } from "../form-data";
import { useStoreCaixa } from "../store";
import ModalActionOcorrencia from "./ModalActionOcorrencia";

const initialPropsOcorrencias: OcorrenciasProps = {
  id: "",
  data_caixa: "",
  data_ocorrencia: "",
  user_criador: "",
  descricao: "",
  resolvida: "0",
  id_user_resolvedor: "",
};

const ModalOcorrencia = () => {
  const user = useAuthStore((state) => state.user);
  const [modalActionOcorrenciaOpen, setModalActionOcorrenciaOpen] = useState(false);
  const [action, setAction] = useState<"Transferência" | "Duplicação" | undefined>();
  const [modalOpen, closeModal, id, data_caixa, id_caixa, id_filial, disabled] = useStoreCaixa(
    (state) => [
      state.modalOcorrenciaOpen,
      state.closeModalOcorrencia,
      state.id_ocorrencia,
      state.data_caixa,
      state.id,
      state.id_filial,
      state.disabled,
    ]
  );
  const formRef = useRef<HTMLFormElement | null>(null);

  const { data, isLoading } = useConferenciasCaixa().getOneOcorrencia(id);
  const {
    mutate: update,
    isSuccess: updateIsSuccess,
    isPending: updateIsPending,
  } = useConferenciasCaixa().updateOcorrencia();
  const {
    mutate: insertOne,
    isSuccess: insertOneIsSuccess,
    isPending: insertOneIsPending,
  } = useConferenciasCaixa().insertOneOcorrencia();

  const newDataCaixa: OcorrenciasProps & Record<string, any> = {} as OcorrenciasProps &
    Record<string, any>;

  for (const key in data) {
    if (typeof data[key] === "number") {
      newDataCaixa[key] = String(data[key]);
    } else if (data[key] === null) {
      newDataCaixa[key] = "";
    } else {
      newDataCaixa[key] = data[key];
    }
  }

  const resolvida = parseInt(String(newDataCaixa?.resolvida) || "0");

  const { form } = useFormOcorrenciaData(
    id
      ? newDataCaixa
      : {
          ...initialPropsOcorrencias,
          id_filial,
          id_user_criador: user?.id,
          user_criador: user?.nome,
          data_caixa: data_caixa || "",
          data_ocorrencia: data_caixa || "",
        }
  );

  function onSubmitData(data: OcorrenciasProps) {
    if (id) update(data);
    if (!id) insertOne(data);
    // console.log(data);
  }

  useEffect(() => {
    updateIsSuccess && closeModal();
  }, [updateIsPending]);
  useEffect(() => {
    insertOneIsSuccess && closeModal();
  }, [insertOneIsPending]);

  function handleClickCancel() {
    closeModal();
  }

  function actionOcorrencia(date: Date) {
    if (action === "Transferência") {
      update({
        ...newDataCaixa,
        data_caixa: date,
      });
    }
    if (action === "Duplicação") {
      insertOne({
        ...newDataCaixa,
        data_caixa: date,
        resolvida: "0",
        id: "",
      });
    }
    setModalActionOcorrenciaOpen(false);
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex gap-4">
            <TbAlertTriangle size={22} className="text-red-500" />
            {id ? `Ocorrência: ${id}` : "Ocorrência"}
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
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
                  readOnly={!!id || !!id_caixa}
                  name="data_caixa"
                  label="Data Caixa"
                  control={form.control}
                  className="flex-1 min-w-[30ch]"
                />
                <FormDateInput
                  readOnly={!!id || !!id_caixa}
                  name="data_ocorrencia"
                  label="Data Ocorrência"
                  control={form.control}
                  className="flex-1 min-w-[30ch]"
                />
                <FormInput
                  readOnly
                  name="user_criador"
                  label="Usuário"
                  control={form.control}
                  className="flex-1 min-w-[30ch]"
                />
                <FormTextarea
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
        {!disabled && (
          <DialogFooter>
            {!id && !resolvida && (
              <div className="flex gap-2 justify-between">
                <Button variant={"secondary"} onClick={handleClickCancel}>
                  <Ban className="me-2" />
                  Cancelar
                </Button>
                <Button onClick={() => formRef.current && formRef.current.requestSubmit()}>
                  <Save className="me-2" />
                  Salvar
                </Button>
              </div>
            )}
            {!!id && (
              <div className="flex gap-2 justify-between w-full">
                <span className="flex gap-2">
                  {!resolvida && (
                    <Button
                      variant={"tertiary"}
                      onClick={() => {
                        setModalActionOcorrenciaOpen(true);
                        setAction("Transferência");
                      }}
                    >
                      <ArrowLeftRight className="me-2" />
                      Transferir
                    </Button>
                  )}
                  <Button
                    title="Copiar para outro caixa"
                    onClick={() => {
                      setModalActionOcorrenciaOpen(true);
                      setAction("Duplicação");
                    }}
                  >
                    <Copy className="me-2" />
                    Copiar
                  </Button>
                </span>
                {!resolvida && (
                  <AlertPopUp
                    title={"Deseja realmente resolver essa ocorrência?"}
                    description="Essa ação não pode ser desfeita. A ocorrência será definitivamente resolvida, não podendo voltar ao status anterior."
                    action={() => {
                      form.setValue("resolvida", 1);
                      form.setValue("id_user_resolvedor", user?.id);
                      formRef.current && formRef.current.requestSubmit();
                    }}
                  >
                    <Button variant={"success"}>
                      <Check className="me-2" />
                      Resolver
                    </Button>
                  </AlertPopUp>
                )}
              </div>
            )}
          </DialogFooter>
        )}
      </DialogContent>
      <ModalActionOcorrencia
        modalOpen={modalActionOcorrenciaOpen}
        handleClickCancel={() => setModalActionOcorrenciaOpen(false)}
        actionOcorrencia={actionOcorrencia}
        dataOcorrencia={startOfDay(form.watch("data_caixa") || "")}
        action={action}
      />
    </Dialog>
  );
};

export default ModalOcorrencia;
