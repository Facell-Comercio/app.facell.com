import FormInput from "@/components/custom/FormInput";
import FormSwitch from "@/components/custom/FormSwitch";

import SelectFilial from "@/components/custom/SelectFilial";
import { Form } from "@/components/ui/form";
import { Toggle } from "@/components/ui/toggle";
import { useGrupoEconomico } from "@/hooks/useGrupoEconomico";
import { GrupoEconomicoFormData, useFormGrupoEconomico } from "./form-data";
import { useStoreGrupoEconomico } from "./store";

const FormUsers = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: GrupoEconomicoFormData;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const { mutate: insertOne } = useGrupoEconomico().insertOne();
  const { mutate: update } = useGrupoEconomico().update();

  const modalEditing = useStoreGrupoEconomico().modalEditing;
  const editModal = useStoreGrupoEconomico().editModal;
  const closeModal = useStoreGrupoEconomico().closeModal;

  const { form } = useFormGrupoEconomico(data);

  const onSubmitData = (newData: GrupoEconomicoFormData) => {
    if (id) update(newData);
    if (!id) insertOne(newData);

    editModal(false);
    closeModal();
  };

  const isActive = !!+form.watch("orcamento");

  return (
    <div className="max-w-full ">
      <Form {...form}>
        <form
          className="flex gap-2 flex-col"
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmitData)}
        >
          <div className="flex w-full items-center justify-between mt-2">
            <p className="text-lg font-semibold">
              {id ? `Grupo Econômico: ${id}` : "Novo Grupo Econômico"}
            </p>
            <FormSwitch
              control={form.control}
              label="Ativo"
              name="active"
              disabled={!modalEditing}
            />
          </div>
          <div className="flex gap-2 items-center">
            <FormInput
              control={form.control}
              label="Nome"
              name="nome"
              readOnly={!modalEditing}
            />

            <FormInput
              control={form.control}
              label="Apelido"
              name="apelido"
              readOnly={!modalEditing}
            />

            <SelectFilial
              name="id_matriz"
              label="Matriz"
              control={form.control}
              disabled={!modalEditing}
            />
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Orçamento</label>
              <Toggle
                variant={"active"}
                className="w-full"
                pressed={isActive}
                disabled={!modalEditing}
                onPressedChange={(value) => form.setValue("orcamento", !!value)}
              >
                {isActive ? "ON" : "OFF"}
              </Toggle>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormUsers;
