import FormInput from "@/components/custom/FormInput";
import FormSwitch from "@/components/custom/FormSwitch";

import { Form } from "@/components/ui/form";
import { useDepartamentos } from "@/hooks/useDepartamentos";
import { DepartamentoFormData, useFormDepartamentoData } from "./form-data";
import { useStoreDepartamento } from "./store";

const FormUsers = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: DepartamentoFormData;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {

  const { mutate: insertOne } = useDepartamentos().insertOne();
  const { mutate: update } = useDepartamentos().update();

  const modalEditing = useStoreDepartamento().modalEditing;
  const editModal = useStoreDepartamento().editModal;
  const closeModal = useStoreDepartamento().closeModal;

  const { form } = useFormDepartamentoData(data);

  const onSubmitData = (newData: DepartamentoFormData) => {
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
