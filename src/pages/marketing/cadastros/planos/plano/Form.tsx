import FormInput from "@/components/custom/FormInput";
import { Form } from "@/components/ui/form";
import { useCadastros } from "@/hooks/marketing/useCadastros";
import { useEffect } from "react";
import { TipoPlanosCombobox } from "../../components/TipoPlanosCombobox";
import { useFormPlanoData } from "./form-data";
import { PlanoSchema } from "./Modal";
import useStorePlanoMailing from "./store";
const FormPlano = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: PlanoSchema;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const {
    mutate: insertOne,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
    isError: insertIsError,
  } = useCadastros().insertOnePlano();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
    isError: updateIsError,
  } = useCadastros().updatePlano();
  const [modalEditing, editModal, closeModal, editIsPending] = useStorePlanoMailing((state) => [
    state.modalEditing,
    state.editModal,
    state.closeModal,
    state.editIsPending,
    state.isPending,
  ]);
  const { form } = useFormPlanoData(data);

  const onSubmitData = (data: PlanoSchema) => {
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

  // ! Verificar a existênicia de erros
  // console.log(form.formState.errors);

  return (
    <div className="max-w-full overflow-x-hidden">
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
          <div className="max-w-full flex flex-col items-end gap-3 flex-wrap">
            {/* Primeira coluna */}
            <FormInput
              className="flex-1 min-w-[20ch] w-full"
              name="plano"
              disabled={!modalEditing}
              label="Nome:"
              control={form.control}
            />
            <div className="flex gap-2 w-full">
              <span className="flex flex-1 flex-col gap-2 ">
                <label className="font-medium text-sm">Produto Não Fidelizado:</label>
                <TipoPlanosCombobox
                  value={form.watch("produto_nao_fidelizado") || ""}
                  onChange={(value) => form.setValue("produto_nao_fidelizado", value)}
                  type="plano_produto_nao_fidelizado"
                  className="w-full"
                  disabled={!modalEditing}
                />
              </span>
              <span className="flex flex-1 flex-col gap-2 ">
                <label className="font-medium text-sm">Produto Fidelizado:</label>
                <TipoPlanosCombobox
                  value={form.watch("produto_fidelizado") || ""}
                  onChange={(value) => form.setValue("produto_fidelizado", value)}
                  type="plano_produto_fidelizado"
                  className="w-full"
                  disabled={!modalEditing}
                />
              </span>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormPlano;
