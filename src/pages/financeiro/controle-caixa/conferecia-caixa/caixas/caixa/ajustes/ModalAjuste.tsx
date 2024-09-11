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
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  ScrollArea,
  ScrollBar,
} from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/context/auth-store";
import {
  checkUserDepartments,
  checkUserPermission,
} from "@/helpers/checkAuthorization";
import {
  AjustesProps,
  useConferenciasCaixa,
} from "@/hooks/financeiro/useConferenciasCaixa";
import { Settings2 } from "lucide-react";
import { useEffect, useRef } from "react";
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
  const user = useAuthStore(
    (state) => state.user
  );

  const [
    modalOpen,
    closeModal,
    id,
    id_caixa,
    disabled,
  ] = useStoreCaixa((state) => [
    state.modalAjusteOpen,
    state.closeModalAjuste,
    state.id_ajuste,
    state.id,
    state.disabled,
  ]);
  const formRef = useRef<HTMLFormElement | null>(
    null
  );

  const { data, isLoading } =
    useConferenciasCaixa().getOneAjuste(id);
  const {
    mutate: update,
    isSuccess: updateIsSuccess,
    isPending: updateIsPending,
  } = useConferenciasCaixa().updateAjuste();
  const {
    mutate: insertOne,
    isSuccess: insertOneIsSuccess,
    isPending: insertOneIsPending,
  } = useConferenciasCaixa().insertOneAjuste();

  const newDataCaixa: AjustesProps &
    Record<string, any> = {} as AjustesProps &
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

  const aprovado = parseInt(
    String(newDataCaixa?.aprovado) || "0"
  );

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
    (tipoAjuste === "transferencia" &&
      checkUserDepartments("FINANCEIRO")) ||
    checkUserDepartments("FINANCEIRO", true) ||
    checkUserPermission("MASTER");

  function onSubmitData(data: AjustesProps) {
    if (id) update(data);
    if (!id) insertOne(data);
    console.log(data);
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

  return (
    <Dialog
      open={modalOpen}
      onOpenChange={handleClickCancel}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex gap-4">
            <Settings2
              size={22}
              className="text-primary"
            />
            {id
              ? `Ajuste Manual: ${id}`
              : "Novo Ajuste Manual"}
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
                  form.handleSubmit(onSubmitData)(
                    e
                  );
                }}
              >
                <span className="flex items-end gap-2 w-full">
                  <FormSelect
                    name={"tipo_ajuste"}
                    label={"Tipo"}
                    control={form.control}
                    disabled={disabled}
                    options={tiposAjuste}
                  />
                  <FormInput
                    name="valor"
                    label="Valor"
                    control={form.control}
                    className="flex-1 min-w-[30ch]"
                    type="number"
                  />
                  <Button
                    className={`${
                      aprovado
                        ? "hover:bg-primary"
                        : "hoverbg-success"
                    } cursor-default`}
                    variant={
                      aprovado
                        ? "success"
                        : "default"
                    }
                  >
                    {aprovado
                      ? "Aprovado"
                      : "Aprovação Pendente"}
                  </Button>
                </span>
                <FormSelect
                  name={"saida"}
                  label={"De"}
                  control={form.control}
                  disabled={disabled}
                  options={tiposCaixa}
                />
                <FormSelect
                  name={"entrada"}
                  label={"Para"}
                  control={form.control}
                  disabled={disabled}
                  options={tiposCaixa}
                />
                <FormTextarea
                  className="flex-1 min-w-full shrink-0"
                  name="obs"
                  readOnly={!!id}
                  label="Observação"
                  control={form.control}
                />
                <FormInput
                  name="user"
                  label="Usuário"
                  control={form.control}
                  disabled={disabled}
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
        {!disabled && (
          <DialogFooter>
            {!id && !aprovado && (
              <div className="flex gap-2 justify-between">
                <Button
                  variant={"secondary"}
                  onClick={handleClickCancel}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() =>
                    formRef.current &&
                    formRef.current.requestSubmit()
                  }
                >
                  Salvar
                </Button>
              </div>
            )}
            {!!id && !aprovado && podeAprovar && (
              <AlertPopUp
                title={
                  "Deseja realmente aprovar esse ajuste?"
                }
                description="Essa ação não pode ser desfeita. A ajuste será definitivamente aprovado, não podendo voltar ao status anterior."
                action={() => {
                  form.setValue("aprovado", "1");

                  formRef.current &&
                    formRef.current.requestSubmit();
                }}
              >
                <Button variant={"success"}>
                  Aprovar
                </Button>
              </AlertPopUp>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalAjuste;
