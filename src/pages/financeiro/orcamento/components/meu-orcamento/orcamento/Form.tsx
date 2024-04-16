import FormInput from "@/components/custom/FormInput";
import { Form } from "@/components/ui/form";
import { useOrcamento } from "@/hooks/useOrcamento";
import ModalCentrosCustos from "@/pages/admin/components/ModalCentrosCustos";
import ModalPlanoContas, {
  ItemPlanoContas,
} from "@/pages/financeiro/components/ModalPlanoContas";
import { CentroCustos } from "@/types/financeiro/centro-custos-type";
import { useState } from "react";
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
  const [modalCentrosCustoOpen, setModalCentrosCustoOpen] = useState(false);
  const [modalPlanoContasOpen, setModalPlanoContasOpen] = useState(false);
  const { mutate: transfer } = useOrcamento().transfer();
  const closeModal = useStoreMeuOrcamento().closeModal;
  const { form } = useFormMeuOrcamentoData(data);

  function handleSelectionCentroCustos(item: CentroCustos) {
    form.setValue("id_centro_custo_entrada", item.id);

    form.setValue("centro_custo_entrada", item.nome);
    setModalCentrosCustoOpen(false);
  }
  function handleSelectionPlanoContas(item: ItemPlanoContas) {
    form.setValue("id_conta_entrada", item.id);
    form.setValue("conta_entrada", item.codigo + " - " + item.descricao);
    setModalPlanoContasOpen(false);
  }

  const onSubmitData = (data: MeuOrcamentoSchema) => {
    transfer(data);
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
                    className="flex-1"
                    name="centro_custo_entrada"
                    readOnly={true}
                    label="Centro de Custo de Saída"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[40ch]"
                    name="conta_saida"
                    readOnly={true}
                    label="Transferir dessa conta"
                    control={form.control}
                  />
                  <FormInput
                    type="number"
                    className="flex-1 max-w-[20ch]"
                    name="disponivel"
                    readOnly={true}
                    label="Valor Disponível"
                    control={form.control}
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <span
                    className="flex-1"
                    onClick={() => setModalCentrosCustoOpen(true)}
                  >
                    <FormInput
                      className="w-full"
                      name="centro_custo_entrada"
                      label="Centro de Custo de Entrada"
                      control={form.control}
                    />
                  </span>
                  <ModalCentrosCustos
                    handleSelecion={handleSelectionCentroCustos}
                    // @ts-expect-error 'Ignore, vai funcionar..'
                    onOpenChange={setModalCentrosCustoOpen}
                    open={modalCentrosCustoOpen}
                    id_grupo_economico={data.id_grupo_economico}
                    closeOnSelection={true}
                  />

                  <span
                    className="flex-1"
                    onClick={() => setModalPlanoContasOpen(true)}
                  >
                    <FormInput
                      className="w-full"
                      name="conta_entrada"
                      label="Para Essa Conta"
                      control={form.control}
                    />
                  </span>
                  <ModalPlanoContas
                    open={modalPlanoContasOpen}
                    id_grupo_economico={data.id_grupo_economico}
                    tipo="Despesa"
                    onOpenChange={() =>
                      setModalPlanoContasOpen((prev: boolean) => !prev)
                    }
                    handleSelecion={handleSelectionPlanoContas}
                  />
                  <FormInput
                    type="number"
                    className="flex-1 max-w-[20ch]"
                    name="valor_transferido"
                    label="Valor a Transferir"
                    min={0.1}
                    max={+data.disponivel}
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
