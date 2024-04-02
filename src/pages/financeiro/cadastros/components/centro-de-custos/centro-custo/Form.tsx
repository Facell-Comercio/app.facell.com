import FormInput from "@/components/custom/FormInput";
import FormSelectGrupoEconomico from "@/components/custom/FormSelectGrupoEconomico";
import FormSwitch from "@/components/custom/FormSwitch";
import { Form } from "@/components/ui/form";
import { useCentroCustos } from "@/hooks/useCentroCustos";
import { Contact } from "lucide-react";
import { CentroCustosSchema } from "./Modal";
import { useFormCentroCustosData } from "./form-data";
import { useStoreCentroCustos } from "./store";

const FormCentroCustos = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: CentroCustosSchema;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  console.log("RENDER - Fornecedor:", id);
  const { mutate: insertOne } = useCentroCustos().insertOne();
  const { mutate: update } = useCentroCustos().update();
  const modalEditing = useStoreCentroCustos().modalEditing;
  const editModal = useStoreCentroCustos().editModal;
  const closeModal = useStoreCentroCustos().closeModal;
  const { form } = useFormCentroCustosData(data);

  const onSubmitData = (data: CentroCustosSchema) => {
    console.log(data);

    if (id) update(data);
    if (!id) insertOne(data);

    editModal(false);
    closeModal();
  };

  console.log(form.formState.errors);

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
                      Dados do Centro de Custos
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
                    className="flex-1 min-w-[20ch]"
                    name="nome"
                    readOnly={!modalEditing}
                    label="Nome"
                    control={form.control}
                  />
                  <FormSelectGrupoEconomico
                    className="flex-1 min-w-32"
                    name="id_grupo_economico"
                    control={form.control}
                    disabled={!modalEditing}
                    label="Grupo Econômico"
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

export default FormCentroCustos;
