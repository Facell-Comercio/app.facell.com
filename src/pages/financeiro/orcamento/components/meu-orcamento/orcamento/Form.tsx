import FormInput from "@/components/custom/FormInput";
import { Form } from "@/components/ui/form";
import { MeuOrcamentoSchema, useFormMeuOrcamentoData } from "./form-data";
import { useStoreMeuOrcamento } from "./store";

const FormMeuOrcamento = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: MeuOrcamentoSchema;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  console.log("RENDER - MeuOrcamento:", id);
  // const { mutate: update } = useOrcamento().update();
  const closeModal = useStoreMeuOrcamento().closeModal;
  const { form } = useFormMeuOrcamentoData(data);

  const onSubmitData = (data: MeuOrcamentoSchema) => {
    // update(data);
    console.log(data);

    closeModal();
  };

  // console.log(form.formState.errors);

  return (
    <div className="max-w-full overflow-x-hidden">
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
          <div className="max-w-full flex flex-col lg:flex-row gap-5">
            {/* Primeira coluna */}
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex flex-wrap gap-3">
                  <FormInput
                    className="flex-1 min-w-[40ch]"
                    name="id_conta_saida"
                    label="Transferir dessa conta"
                    control={form.control}
                  />
                  <FormInput
                    type="number"
                    className="flex-1 min-w-40"
                    name="disponivel"
                    readOnly={true}
                    label="Valor Disponível"
                    control={form.control}
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <FormInput
                    className="flex-1 min-w-40"
                    name="id_conta_entrada"
                    label="Para Essa Conta"
                    control={form.control}
                  />
                  <FormInput
                    type="number"
                    className="flex-1 min-w-[40ch]"
                    name="valor_tranferido"
                    label="Valor a Transferir"
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

export default FormMeuOrcamento;
