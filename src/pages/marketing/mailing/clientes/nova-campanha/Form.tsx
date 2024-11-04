import FormDateInput from "@/components/custom/FormDate";
import FormInput from "@/components/custom/FormInput";
import { Form } from "@/components/ui/form";
import { useMailing } from "@/hooks/marketing/useMailing";
import { useEffect } from "react";
import { useStoreTableClientes } from "../table/store-table";
import { NovaCampanhaSchema, useFormNovaCampanhaData } from "./form-data";
import { useStoreNovaCampanha } from "./store";

const FormNovaCampanha = ({
  formRef,
}: {
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const {
    mutate: insertOneCampanha,
    isPending: insertOneCampanhaIsPending,
    isSuccess: insertOneCampanhaSuccess,
    isError: insertOneCampanhaIsError,
  } = useMailing().insertOneCampanha();

  const [closeModal, qtde_total, setIsPending, isPending] = useStoreNovaCampanha((state) => [
    state.closeModal,
    state.qtde_total,
    state.setIsPending,
    state.isPending,
  ]);
  const filters = useStoreTableClientes().filters;

  const { form } = useFormNovaCampanhaData({
    nome: "",
    quantidade_total_clientes: String(qtde_total || "0"),
    data_inicio: undefined,
  });

  const onSubmitData = (data: NovaCampanhaSchema) => {
    insertOneCampanha({ ...data, filters });
  };

  useEffect(() => {
    if (insertOneCampanhaIsPending) {
      setIsPending(true);
    }
    if (insertOneCampanhaSuccess) {
      closeModal();
      setIsPending(false);
    }
    if (insertOneCampanhaIsError) {
      setIsPending(false);
    }
  }, [insertOneCampanhaIsPending]);

  // console.log(form.formState.errors);

  return (
    <div className="max-w-full overflow-x-hidden">
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
          <div className="max-w-full flex flex-col lg:flex-row gap-5">
            <div className="flex flex-1 flex-col gap-1 shrink-0">
              {/* Primeira coluna */}
              <section className="flex flex-col gap-3 p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex flex-wrap gap-3 items-end">
                  <FormInput
                    className="min-w-[30ch] flex-1"
                    inputClass="uppercase"
                    name="nome"
                    label="Nome:"
                    placeholder="NOME DA NOVA CAMPANHA"
                    control={form.control}
                    disabled={isPending}
                  />
                  <FormDateInput
                    name="data_inicio"
                    label="Data de Início:"
                    className="min-w-[30ch] flex-1"
                    control={form.control}
                    disabled={isPending}
                  />
                  <FormInput
                    type="number"
                    className="min-w-[30ch] flex-1"
                    name="quantidade_total_clientes"
                    readOnly
                    label="Quantidade Total de Clientes:"
                    control={form.control}
                    disabled={isPending}
                    min={1}
                  />
                </div>
              </section>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormNovaCampanha;
