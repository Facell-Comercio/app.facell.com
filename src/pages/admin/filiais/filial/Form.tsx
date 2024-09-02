import FormInput from "@/components/custom/FormInput";
import FormSwitch from "@/components/custom/FormSwitch";

import FormSelectGrupoEconomico from "@/components/custom/FormSelectGrupoEconomico";
import { SelectFilial } from "@/components/custom/SelectFilial";
import { Form } from "@/components/ui/form";
import { useFilial } from "@/hooks/useFilial";
import { FilialFormData, useFormFilialData } from "./form-data";
import { useStoreFilial } from "./store";

const FormUsers = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: FilialFormData;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const { mutate: insertOne } = useFilial().insertOne();
  const { mutate: update } = useFilial().update();

  const modalEditing = useStoreFilial().modalEditing;
  const editModal = useStoreFilial().editModal;
  const closeModal = useStoreFilial().closeModal;

  const { form } = useFormFilialData(data);

  const onSubmitData = (newData: FilialFormData) => {
    if (id) update(newData);
    if (!id) insertOne(newData);

    editModal(false);
    closeModal();
  };

  return (
    <div className="max-w-full ">
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
          <div className="flex flex-col gap-3 p-2">
            <div className="mb-3">
              <h3 className="text-primary font-light">
                Informações principais
              </h3>

              <div className="flex gap-5 mb-3">
                <FormInput name="id" type="hidden" control={form.control} />

                <FormInput
                  control={form.control}
                  label="Nome"
                  name="nome"
                  readOnly={!modalEditing}
                />

                <FormInput
                  control={form.control}
                  label="CNPJ"
                  name="cnpj"
                  readOnly={!modalEditing}
                />

                <FormSwitch
                  control={form.control}
                  label="Ativo"
                  name="active"
                  disabled={!modalEditing}
                />
              </div>

              <div className="flex gap-5 mb-3">
                <FormSelectGrupoEconomico
                  control={form.control}
                  name="id_grupo_economico"
                  label="Grupo Econômico"
                />

                <SelectFilial
                  control={form.control}
                  name="id_matriz"
                  label="Matriz"
                />

                <FormInput
                  control={form.control}
                  label="Código Datasys"
                  name="cod_datasys"
                  readOnly={!modalEditing}
                />

                <FormInput
                  control={form.control}
                  label="CNPJ Datasys"
                  name="cnpj_datasys"
                  readOnly={!modalEditing}
                />
              </div>

              <div className="flex gap-5 mb-3">
                <FormInput
                  control={form.control}
                  label="Apelido"
                  name="apelido"
                  readOnly={!modalEditing}
                />
              </div>
            </div>

            <div className="mb-3">
              <h3 className="text-primary font-light">Outras informações</h3>
              <div className="flex gap-5">
                <FormInput
                  control={form.control}
                  label="Nome fantasia"
                  name="nome_fantasia"
                  readOnly={!modalEditing}
                />

                <FormInput
                  control={form.control}
                  label="Razão social"
                  name="razao"
                  readOnly={!modalEditing}
                />
              </div>
              <div className="flex gap-5">
                <FormInput
                  control={form.control}
                  label="Telefone"
                  name="telefone"
                  readOnly={!modalEditing}
                />

                <FormInput
                  control={form.control}
                  label="Email"
                  name="email"
                  readOnly={!modalEditing}
                />
              </div>
            </div>

            <div className="mb-3">
              <h3 className="text-primary font-light">Endereço</h3>
              <div className="flex gap-5">
                <FormInput
                  control={form.control}
                  label="Logradouro"
                  name="logradouro"
                  readOnly={!modalEditing}
                />

                <FormInput
                  control={form.control}
                  label="Numero"
                  name="numero"
                  readOnly={!modalEditing}
                />

                <FormInput
                  control={form.control}
                  label="Complemento"
                  name="complemento"
                  readOnly={!modalEditing}
                />
              </div>
              <div className="flex gap-5">
                <FormInput
                  control={form.control}
                  label="Cep"
                  name="cep"
                  readOnly={!modalEditing}
                />

                <FormInput
                  control={form.control}
                  label="Municipio"
                  name="municipio"
                  readOnly={!modalEditing}
                />

                <FormInput
                  control={form.control}
                  label="UF"
                  name="uf"
                  readOnly={!modalEditing}
                />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormUsers;
