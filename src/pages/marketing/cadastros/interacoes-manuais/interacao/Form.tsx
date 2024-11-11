import FormDateInput from "@/components/custom/FormDate";
import FormInput from "@/components/custom/FormInput";
import FormTextarea from "@/components/custom/FormTextarea";
import { Form } from "@/components/ui/form";
import { useCadastros } from "@/hooks/marketing/useCadastros";
import ModalVendedores, {
  ItemVendedor,
} from "@/pages/marketing/mailing/components/ModalVendedores";
import { subDays } from "date-fns";
import { useEffect, useState } from "react";
import { useFormInteracaoManualData } from "./form-data";
import { InteracaoManualSchema } from "./Modal";
import { useStoreInteracaoManual } from "./store";

const FormInteracaoManual = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: InteracaoManualSchema;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const {
    mutate: insertOne,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
    isError: insertIsError,
  } = useCadastros().insertOneInteracaoManual();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
    isError: updateIsError,
  } = useCadastros().updateInteracaoManual();
  const [modalEditing, editModal, closeModal, editIsPending] = useStoreInteracaoManual((state) => [
    state.modalEditing,
    state.editModal,
    state.closeModal,
    state.editIsPending,
    state.isPending,
  ]);
  const { form } = useFormInteracaoManualData(data);

  const onSubmitData = (data: InteracaoManualSchema) => {
    if (id) update(data);
    if (!id) insertOne(data);
    // console.log(data);
  };

  useEffect(() => {
    if (updateIsSuccess || insertIsSuccess) {
      editModal(false);
      closeModal();
      editIsPending(false);
    } else if (updateIsError || insertIsError) {
      editIsPending(false);
    } else if (updateIsPending || insertIsPending) {
      editIsPending(true);
    }
  }, [updateIsPending, insertIsPending]);

  const [modalVendedoresOpen, setModalVendedoresOpen] = useState(false);
  function handleSelection(vendedor: ItemVendedor) {
    form.setValue("operador", vendedor.nome);
  }

  // ! Verificar a existênicia de erros
  // console.log(form.formState.errors);

  return (
    <div className="max-w-full overflow-x-hidden">
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
          <div className="max-w-full flex-col flex items-end gap-3">
            <div className="flex gap-2 flex-wrap w-full">
              <FormInput
                className="flex-1 min-w-[20ch]"
                name="nome_assinante"
                disabled={!modalEditing}
                label="Cliente"
                control={form.control}
              />
              <FormInput
                className="flex-1 min-w-[20ch]"
                name="gsm"
                disabled={!modalEditing}
                label="GSM"
                control={form.control}
              />
              <FormInput
                className="flex-1 min-w-[20ch]"
                name="cpf"
                disabled={!modalEditing}
                label="CPF"
                control={form.control}
              />
            </div>
            <div className="flex gap-2 flex-wrap w-full">
              <FormInput
                className="flex-1 min-w-[20ch]"
                name="operador"
                disabled={!modalEditing}
                label="Operador"
                readOnly
                control={form.control}
                onClick={() => setModalVendedoresOpen(true)}
              />
              <FormDateInput
                className="flex-1 min-w-[20ch]"
                name="data"
                disabled={!modalEditing}
                label="Data"
                max={subDays(new Date(), 1)}
                min={subDays(new Date(), 30)}
                control={form.control}
              />
            </div>
            <FormTextarea
              className="w-full flex-1 min-w-[20ch]"
              name="observacao"
              disabled={!modalEditing}
              label="Observação"
              control={form.control}
            />
          </div>
        </form>
      </Form>
      <ModalVendedores
        open={modalVendedoresOpen}
        onOpenChange={() => setModalVendedoresOpen(false)}
        handleSelection={handleSelection}
        closeOnSelection
      />
    </div>
  );
};

export default FormInteracaoManual;
