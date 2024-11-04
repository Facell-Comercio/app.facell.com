import FormInput from "@/components/custom/FormInput";
import FormSelect from "@/components/custom/FormSelect";
import FormSelectGrupoEconomico from "@/components/custom/FormSelectGrupoEconomico";
import FormSwitch from "@/components/custom/FormSwitch";
import { Form } from "@/components/ui/form";
import { usePlanoContas } from "@/hooks/financeiro/usePlanoConta";
import { Fingerprint, Info } from "lucide-react";
import { useEffect } from "react";
import { PlanoContasSchema } from "./Modal";
import { useFormPlanoContaData } from "./form-data";
import { useStorePlanoContas } from "./store";

const FormPlanoContas = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: PlanoContasSchema;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const {
    mutate: insertOne,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
    isError: insertIsError,
  } = usePlanoContas().insertOne();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
    isError: updateIsError,
  } = usePlanoContas().update();
  const [modalEditing, editModal, closeModal, editIsPending, isPending] = useStorePlanoContas(
    (state) => [
      state.modalEditing,
      state.editModal,
      state.closeModal,
      state.editIsPending,
      state.isPending,
    ]
  );

  const onSubmitData = (data: PlanoContasSchema) => {
    // console.log(data);

    if (id) update(data);
    if (!id) insertOne(data);
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
  const { form } = useFormPlanoContaData(data);
  // ! Verificar a existênicia de erros
  // console.log(form.formState.errors);

  return (
    <div className="max-w-full max-h-[90vh] overflow-hidden">
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
          <div className="max-w-full flex flex-col lg:flex-row gap-5">
            {/* Primeira coluna */}
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex justify-between mb-3">
                  <div className="flex gap-2">
                    <Fingerprint />{" "}
                    <span className="text-lg font-bold ">Identificação do Plano Contas</span>
                  </div>
                  <FormSwitch
                    name="active"
                    disabled={!modalEditing || isPending}
                    label="Ativo"
                    control={form.control}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <FormInput name="id" type="hidden" label="ID" control={form.control} />
                  <FormInput
                    className="flex-1 min-w-40"
                    name="codigo"
                    readOnly={!modalEditing || isPending}
                    label="Código"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[40ch]"
                    name="descricao"
                    readOnly={!modalEditing || isPending}
                    label="Descrição"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-40"
                    name="codigo_pai"
                    readOnly={!modalEditing || isPending}
                    label="Código Pai"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[40ch]"
                    readOnly={!modalEditing || isPending}
                    name="descricao_pai"
                    label="Descrição Pai"
                    control={form.control}
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Info /> <span className="text-lg font-bold ">Parâmetros</span>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <FormInput
                    className="flex-1 min-w-32"
                    readOnly={!modalEditing || isPending}
                    name="nivel"
                    label="Nível de Controle"
                    control={form.control}
                  />
                  <FormSelect
                    name="tipo"
                    disabled={!modalEditing || isPending}
                    control={form.control}
                    label={"Tipo"}
                    className={"flex-1 min-w-[20ch]"}
                    options={[
                      { value: "Receita", label: "RECEITA" },
                      { value: "Despesa", label: "DESPESA" },
                    ]}
                  />
                  <FormSelectGrupoEconomico
                    className="min-w-32"
                    name="id_grupo_economico"
                    disabled={!modalEditing || isPending}
                    label="Grupo Econômico"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-44"
                    readOnly={!modalEditing || isPending}
                    name="codigo_conta_estorno"
                    label="Código Contra Estorno"
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

export default FormPlanoContas;
