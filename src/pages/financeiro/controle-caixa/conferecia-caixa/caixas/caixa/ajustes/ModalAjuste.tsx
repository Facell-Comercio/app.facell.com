import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AlertPopUp from "@/components/custom/AlertPopUp";
import FormInput from "@/components/custom/FormInput";
import FormSelect from "@/components/custom/FormSelect";
import FormTextarea from "@/components/custom/FormTextarea";
import ModalButtons from "@/components/custom/ModalButtons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/context/auth-store";
import { checkUserDepartments, checkUserPermission } from "@/helpers/checkAuthorization";
import { AjustesProps, useConferenciasCaixa } from "@/hooks/financeiro/useConferenciasCaixa";
import { Check, Settings2, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { TbCurrencyReal } from "react-icons/tb";
import { useFormAjusteData } from "../form-data";
import { useStoreCaixa } from "../store";

const initialPropsAjustes: AjustesProps = {
  id: "",
  id_caixa: "",
  id_user: "",
  user: "",
  saida: "",
  entrada: "",
  valor: "0",
  obs: "",
  aprovado: "",
  id_user_aprovador: "",
};

export const tiposCaixa = [
  { label: "Dinheiro", value: "valor_dinheiro" },
  { label: "PIX", value: "valor_pix" },
  { label: "Cartão", value: "valor_cartao" },
  { label: "Pitzi", value: "valor_pitzi" },
  { label: "Tradein", value: "valor_tradein" },
  {
    label: "Crediário",
    value: "valor_crediario",
  },
];

export const tiposAjuste = [
  {
    value: "transferencia",
    label: "Transferência",
  },
  {
    value: "inclusao",
    label: "Inclusão",
  },
  {
    value: "retirada",
    label: "Retirada",
  },
];

const ModalAjuste = () => {
  const user = useAuthStore((state) => state.user);

  const [modalOpen, closeModal, id, id_caixa, editModal, modalEditing, setIsPending, isPending] =
    useStoreCaixa((state) => [
      state.modalAjusteOpen,
      state.closeModalAjuste,
      state.id_ajuste,
      state.id,
      state.editModalAjuste,
      state.modalAjusteEditing,
      state.setIsPending,
      state.isPending,
    ]);
  const formRef = useRef<HTMLFormElement | null>(null);

  const { data, isLoading } = useConferenciasCaixa().getOneAjuste(id);
  const {
    mutate: update,
    isSuccess: updateIsSuccess,
    isPending: updateIsPending,
    isError: updateIsError,
  } = useConferenciasCaixa().updateAjuste();
  const {
    mutate: insertOne,
    isSuccess: insertOneIsSuccess,
    isPending: insertOneIsPending,
    isError: insertOneIsError,
  } = useConferenciasCaixa().insertOneAjuste();
  const {
    mutate: deleteAjuste,
    isSuccess: deleteAjusteIsSuccess,
    isPending: deleteAjusteIsPending,
    isError: deleteAjusteIsError,
  } = useConferenciasCaixa().deleteAjuste();
  const {
    mutate: aprovarAjuste,
    isSuccess: aprovarAjusteIsSuccess,
    isPending: aprovarAjusteIsPending,
    isError: aprovarAjusteIsError,
  } = useConferenciasCaixa().aprovarAjuste();

  const newDataCaixa: AjustesProps & Record<string, any> = {} as AjustesProps & Record<string, any>;

  for (const key in data) {
    if (typeof data[key] === "number") {
      newDataCaixa[key] = String(data[key]);
    } else if (data[key] === null) {
      newDataCaixa[key] = "";
    } else {
      newDataCaixa[key] = data[key];
    }
  }

  const aprovado = parseInt(String(newDataCaixa?.aprovado) || "0");

  const { form } = useFormAjusteData(
    id
      ? newDataCaixa
      : {
          ...initialPropsAjustes,
          id_caixa: id_caixa || "",
          user: user?.nome,
        }
  );
  const tipoAjuste = form.watch("tipo_ajuste");
  const podeAprovar =
    (tipoAjuste === "transferencia" && checkUserDepartments("FINANCEIRO")) ||
    checkUserDepartments("FINANCEIRO", true) ||
    checkUserPermission("MASTER");

  function onSubmitData(data: AjustesProps) {
    if (id) update(data);
    if (!id) insertOne(data);
  }

  useEffect(() => {
    if (updateIsPending) {
      setIsPending(true);
    }
    if (updateIsSuccess) {
      closeModal();
      setIsPending(false);
    }
    if (updateIsError) {
      setIsPending(false);
    }
  }, [updateIsPending]);

  useEffect(() => {
    if (insertOneIsPending) {
      setIsPending(true);
    }
    if (insertOneIsSuccess) {
      closeModal();
      setIsPending(false);
    }
    if (insertOneIsError) {
      setIsPending(false);
    }
  }, [insertOneIsPending]);

  useEffect(() => {
    if (deleteAjusteIsPending) {
      setIsPending(true);
    }
    if (deleteAjusteIsSuccess) {
      closeModal();
      setIsPending(false);
    }
    if (deleteAjusteIsError) {
      setIsPending(false);
    }
  }, [deleteAjusteIsPending]);

  useEffect(() => {
    if (aprovarAjusteIsPending) {
      setIsPending(true);
    }
    if (aprovarAjusteIsSuccess) {
      closeModal();
      setIsPending(false);
    }
    if (aprovarAjusteIsError) {
      setIsPending(false);
    }
  }, [aprovarAjusteIsPending]);

  useEffect(() => {
    !modalOpen && form.reset();
  }, [modalOpen]);

  useEffect(() => {
    if (tipoAjuste === "inclusao") {
      form.setValue("saida", "");
    }
    if (tipoAjuste === "retirada") {
      form.setValue("entrada", "");
    }
  }, [tipoAjuste]);

  function handleClickCancel() {
    closeModal();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex gap-4">
            <Settings2 size={22} className="text-primary" />
            {id ? `Ajuste Manual: ${id}` : "Novo Ajuste Manual"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <Form {...form}>
              <form
                className="flex gap-2 flex-wrap px-1"
                ref={formRef}
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit(onSubmitData)(e);
                }}
              >
                <span className="flex items-end gap-2 w-full">
                  <FormSelect
                    name={"tipo_ajuste"}
                    label={"Tipo"}
                    control={form.control}
                    disabled={isPending || !modalEditing}
                    options={tiposAjuste}
                  />
                  <FormInput
                    name="valor"
                    label="Valor"
                    control={form.control}
                    disabled={isPending || !modalEditing}
                    className="flex-1 min-w-[30ch]"
                    type="number"
                    iconLeft
                    icon={TbCurrencyReal}
                    iconClass="bg-secondary"
                  />
                  {id && (
                    <div
                      className={`flex items-center justify-center py-2 px-3 text-sm min-h-10 rounded-md font-medium ${
                        aprovado ? "bg-success" : "bg-warning"
                      }`}
                    >
                      {aprovado ? "Aprovado" : "Aprovação Pendente"}
                    </div>
                  )}
                </span>

                {(tipoAjuste === "transferencia" || tipoAjuste === "retirada") && (
                  <FormSelect
                    name={"saida"}
                    label={"Saída"}
                    control={form.control}
                    disabled={isPending || !modalEditing}
                    options={tiposCaixa}
                  />
                )}
                {(tipoAjuste === "transferencia" || tipoAjuste === "inclusao") && (
                  <FormSelect
                    name={"entrada"}
                    label={"Entrada"}
                    control={form.control}
                    disabled={isPending || !modalEditing}
                    options={tiposCaixa}
                  />
                )}
                <FormTextarea
                  className="flex-1 min-w-full shrink-0 scroll-thin"
                  name="obs"
                  readOnly={!!id}
                  label="Observação"
                  control={form.control}
                  disabled={isPending || !modalEditing}
                />
                <FormInput
                  name="user"
                  label="Usuário"
                  control={form.control}
                  disabled={isPending || !modalEditing}
                  readOnly
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
          <ModalButtons
            id={id}
            modalEditing={modalEditing}
            edit={() => editModal(true)}
            cancel={handleClickCancel}
            formRef={formRef}
            isLoading={isPending}
          >
            <div className="flex items-end gap-2">
              <AlertPopUp
                title={"Deseja realmente remover esse ajuste?"}
                description="Essa ação não pode ser desfeita. A ajuste será definitivamente removido do servidor e todas as mudanças realizaadas por ele desfeitas."
                action={() => deleteAjuste(id)}
              >
                <Button variant={"destructive"} size={"lg"}>
                  <Trash2 size={18} className="me-2" />
                  Remover Ajuste
                </Button>
              </AlertPopUp>
              {!!id && !aprovado && podeAprovar && (
                <AlertPopUp
                  title={"Deseja realmente aprovar esse ajuste?"}
                  description="Essa ação não pode ser desfeita. A ajuste será definitivamente aprovado, não podendo voltar ao status anterior."
                  action={() => aprovarAjuste(id)}
                >
                  <Button variant={"success"} size={"lg"}>
                    <Check size={18} className="me-2" />
                    Aprovar
                  </Button>
                </AlertPopUp>
              )}
            </div>
          </ModalButtons>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAjuste;
