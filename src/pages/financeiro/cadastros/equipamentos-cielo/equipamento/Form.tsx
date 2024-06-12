import FormInput from "@/components/custom/FormInput";
import FormSwitch from "@/components/custom/FormSwitch";
import SelectFilial from "@/components/custom/SelectFilial";
import { Form } from "@/components/ui/form";
import { useEquipamentos } from "@/hooks/financeiro/useEquipamentos";
import { Contact } from "lucide-react";
import { useEffect } from "react";
import { EquipamentoSchema } from "./Modal";
import { useFormEquipamentoData } from "./form-data";
import { useStoreEquipamento } from "./store";

const FormEquipamento = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: EquipamentoSchema;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const {
    mutate: insertOne,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
    isError: insertIsError,
  } = useEquipamentos().insertOne();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
    isError: updateIsError,
  } = useEquipamentos().update();

  const [modalEditing, editModal, closeModal, editIsPending, isPending] =
    useStoreEquipamento((state) => [
      state.modalEditing,
      state.editModal,
      state.closeModal,
      state.editIsPending,
      state.isPending,
    ]);
  const { form } = useFormEquipamentoData(data);

  const onSubmitData = (data: EquipamentoSchema) => {
    // console.log(data);

    id && update(data);
    !id && insertOne(data);
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
    <div className="max-w-full">
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
                      Dados do Equipamento
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
                  <SelectFilial
                    className="min-w-32"
                    name="id_filial"
                    disabled={!modalEditing || isPending}
                    label="Filial"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[20ch]"
                    name="estabelecimento"
                    readOnly={!modalEditing || isPending}
                    label="Estabelecimento"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[20ch]"
                    name="num_maquina"
                    readOnly={!modalEditing || isPending}
                    label="Número da Máquina"
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

export default FormEquipamento;
