import FormInput from "@/components/custom/FormInput";
import FormSelectGrupoEconomico from "@/components/custom/FormSelectGrupoEconomico";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import {
  CadastroSchemaReplyProps,
  useFormCadastroData,
} from "./form-data-reply";
import { useStoreCadastro } from "./store";

const FormCadastro = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: CadastroSchemaReplyProps;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  console.log("RENDER - Cadastro:", id);
  // const { mutate: insertOne } = useOrcamento().insertOne();
  // const { mutate: update } = useOrcamento().update();
  const closeModal = useStoreCadastro().closeModal;
  const { form } = useFormCadastroData(data);

  const onSubmitData = (data: CadastroSchemaReplyProps) => {
    // if (id) update(data);
    // if (!id) insertOne(data);

    toast({ title: "Submit", description: JSON.stringify(data, undefined, 2) });

    closeModal();
  };

  // console.log(form.formState.errors);

  return (
    <div className="max-w-full overflow-x-hidden">
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
          <div className="max-w-full flex lg:flex-row gap-5 p-2">
            {/* Primeira coluna */}
            <FormSelectGrupoEconomico
              className="flex-1"
              name="id_grupo_economico"
              label="Grupo Econômico"
              control={form.control}
            />
            <FormInput
              className="flex-1 max-w-[20ch]"
              name="ref"
              label="Referência"
              control={form.control}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormCadastro;
