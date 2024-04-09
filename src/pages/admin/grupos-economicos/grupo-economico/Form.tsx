import FormInput from "@/components/custom/FormInput";
import FormSwitch from "@/components/custom/FormSwitch";

import { Form } from "@/components/ui/form";
import { GrupoEconomicoFormData, useFormGrupoEconomico } from "./form-data";
import { useStoreGrupoEconomico } from "./store";
import SelectFilial from "@/components/custom/SelectFilial";
import { useGrupoEconomico } from "@/hooks/useGrupoEconomico";

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
  }

  return (
    <div className="max-w-full ">
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
          <FormInput
            name="id"
            type="hidden"
            control={form.control}
          />

          <div className="flex gap-5 items-center py-10 px-3">

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

            <FormSwitch control={form.control}
              label="Ativo"
              name="active"
              disabled={!modalEditing}
            />

          </div>

        </form>
      </Form>
    </div>
  );
};

export default FormUsers;
