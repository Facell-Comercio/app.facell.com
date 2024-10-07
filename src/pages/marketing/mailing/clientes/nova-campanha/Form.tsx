import FormInput from "@/components/custom/FormInput";
import { Form } from "@/components/ui/form";
import { useMailing } from "@/hooks/marketing/useMailing";
import { useState } from "react";
import { NovaCampanhaSchema, useFormNovaCampanhaData } from "./form-data";
import { useStoreNovaCampanha } from "./store";

const FormNovaCampanha = ({
  formRef,
}: {
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const { mutate: insertOneCampanha } = useMailing().insertOneCampanha();

  const [closeModal, qtde_total] = useStoreNovaCampanha((state) => [
    state.closeModal,
    state.qtde_total,
  ]);

  const [lotes, setLotes] = useState([]);

  const { form } = useFormNovaCampanhaData({
    nome: "",
    quantidade_lotes: "4",
    quantidade_total_clientes: String(qtde_total || "0"),
    lotes,
  });

  const quantidade_lotes = parseFloat(form.watch("quantidade_lotes"));
  const quantidade_total_clientes = parseFloat(form.watch("quantidade_total_clientes"));

  // useEffect(() => {
  //   // Função que divide os clientes igualmente entre os lotes
  //   const clientesPorLote = Math.floor(quantidade_total_clientes / quantidade_lotes);
  //   const lotesDistribuidos = [];
  //   for (let i = 0; i < quantidade_lotes; i++) {
  //     if (i === quantidade_lotes - 1) {
  //       // O último lote recebe o restante
  //       lotesDistribuidos.push(clientesPorLote + (quantidade_total_clientes % quantidade_lotes));
  //     } else {
  //       lotesDistribuidos.push(clientesPorLote);
  //     }
  //   }
  //   setLotes(lotesDistribuidos);
  // }, [quantidade_total_clientes, quantidade_lotes]);

  const onSubmitData = (data: NovaCampanhaSchema) => {
    insertOneCampanha(data);
    closeModal();
  };

  // console.log(form.formState.errors);

  return (
    <div className="max-w-full overflow-x-hidden">
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
          <div className="max-w-full flex flex-col lg:flex-row gap-5">
            <div className="flex flex-1 flex-col gap-1 shrink-0">
              {/* Primeira coluna */}
              <div className="flex flex-col gap-3 p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex flex-wrap gap-3 ">
                  <FormInput
                    className="min-w-[30ch] flex-1"
                    name="nome"
                    label="Nome:"
                    placeholder="NOME DA NOVA CAMPANHA"
                    control={form.control}
                  />
                  <FormInput
                    className="min-w-[30ch] flex-1"
                    name="quantidade_lotes"
                    label="Quantidade de Lotes:"
                    control={form.control}
                    type="number"
                  />
                  <FormInput
                    type="number"
                    className="min-w-[30ch] flex-1"
                    name="quantidade_total_clientes"
                    readOnly
                    label="Quantidade Total de Clientes:"
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

export default FormNovaCampanha;
