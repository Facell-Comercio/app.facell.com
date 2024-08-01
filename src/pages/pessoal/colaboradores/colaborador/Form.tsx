import FormInput from "@/components/custom/FormInput";
import FormSwitch from "@/components/custom/FormSwitch";
import { Form } from "@/components/ui/form";
import {
  ColaboradorSchema,
  useColaboradores,
} from "@/hooks/pessoal/useColaboradores";
import { Contact } from "lucide-react";
import { useEffect } from "react";
import { useFormColaboradorData } from "./form-data";
import { useStoreColaborador } from "./store";

const FormColaborador = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: ColaboradorSchema;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const {
    mutate: insertOne,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
    isError: insertIsError,
  } = useColaboradores().insertOne();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
    isError: updateIsError,
  } = useColaboradores().update();
  const [modalEditing, editModal, closeModal, editIsPending, isPending] =
    useStoreColaborador((state) => [
      state.modalEditing,
      state.editModal,
      state.closeModal,
      state.editIsPending,
      state.isPending,
    ]);

  const { form } = useFormColaboradorData(data);

  const onSubmitData = (data: ColaboradorSchema) => {
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
          <div className="max-w-full flex flex-col lg:flex-row gap-5">
            {/* Primeira coluna */}
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex justify-between mb-3">
                  <div className="flex gap-2">
                    <Contact />{" "}
                    <span className="text-lg font-bold ">
                      Dados do Colaborador
                    </span>
                  </div>
                  <FormSwitch
                    name="active"
                    disabled={!modalEditing || isPending}
                    label="Ativo"
                    control={form.control}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <FormInput
                    className="flex-1 min-w-[20ch]"
                    name="nome"
                    disabled={!modalEditing || isPending}
                    label="Nome"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[40ch] shrink-0"
                    name="cpf"
                    disabled={!modalEditing || isPending}
                    label="CPF"
                    control={form.control}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormColaborador;
