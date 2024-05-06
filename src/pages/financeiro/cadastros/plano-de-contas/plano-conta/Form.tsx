import FormInput from "@/components/custom/FormInput";
import FormSelect from "@/components/custom/FormSelect";
import FormSelectGrupoEconomico from "@/components/custom/FormSelectGrupoEconomico";
import FormSwitch from "@/components/custom/FormSwitch";
import { Form } from "@/components/ui/form";
import { usePlanoContas } from "@/hooks/financeiro/usePlanoConta";
import { Fingerprint, Info } from "lucide-react";
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
  console.log("RENDER - PlanoContas:", id);
  const { mutate: insertOne } = usePlanoContas().insertOne();
  const { mutate: update } = usePlanoContas().update();
  const modalEditing = useStorePlanoContas().modalEditing;
  const editModal = useStorePlanoContas().editModal;
  const closeModal = useStorePlanoContas().closeModal;

  const onSubmitData = (data: PlanoContasSchema) => {
    console.log(data);

    if (id) update(data);
    if (!id) insertOne(data);

    editModal(false);
    closeModal();
  };

  const { form } = useFormPlanoContaData(data);

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
                    <span className="text-lg font-bold ">
                      Identificação do Plano Contas
                    </span>
                  </div>
                  <FormSwitch
                    name="active"
                    disabled={!modalEditing}
                    label="Ativo"
                    control={form.control}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <FormInput
                    name="id"
                    type="hidden"
                    label="ID"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-40"
                    name="codigo"
                    readOnly={!modalEditing}
                    label="Código"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[40ch]"
                    name="descricao"
                    readOnly={!modalEditing}
                    label="Descrição"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-40"
                    name="codigo_pai"
                    readOnly={!modalEditing}
                    label="Código Pai"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[40ch]"
                    readOnly={!modalEditing}
                    name="descricao_pai"
                    label="Descrição Pai"
                    control={form.control}
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Info />{" "}
                  <span className="text-lg font-bold ">Parâmetros</span>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <FormInput
                    className="flex-1 min-w-32"
                    readOnly={!modalEditing}
                    name="nivel"
                    label="Nível de Controle"
                    control={form.control}
                  />
                  <FormSelect
                    name="tipo"
                    disabled={!modalEditing}
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
                    disabled={!modalEditing}
                    label="Grupo Econômico"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-44"
                    readOnly={!modalEditing}
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
