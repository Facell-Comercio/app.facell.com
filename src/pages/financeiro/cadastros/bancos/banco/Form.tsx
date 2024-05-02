import FormInput from "@/components/custom/FormInput";
import { Form } from "@/components/ui/form";
import { useBancos } from "@/hooks/useBancos";
import { Contact } from "lucide-react";
import { BancoSchema } from "./Modal";
import { useFormBancoData } from "./form-data";
import { useStoreBanco } from "./store";

const FormBanco = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: BancoSchema;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  console.log("RENDER - Fornecedor:", id);
  const { mutate: insertOne } = useBancos().insertOne();
  const { mutate: update } = useBancos().update();
  const modalEditing = useStoreBanco().modalEditing;
  const editModal = useStoreBanco().editModal;
  const closeModal = useStoreBanco().closeModal;
  const { form } = useFormBancoData(data);

  const onSubmitData = (data: BancoSchema) => {
    if (id) update(data);
    if (!id) insertOne(data);
    console.log(data);

    editModal(false);
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
                <div className="flex justify-between mb-3">
                  <div className="flex gap-2">
                    <Contact />{" "}
                    <span className="text-lg font-bold ">Dados do Banco</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <FormInput
                    className="flex-1 min-w-[20ch]"
                    name="codigo"
                    readOnly={!modalEditing}
                    label="Código do Banco"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[40ch] shrink-0"
                    name="nome"
                    readOnly={!modalEditing}
                    label="Nome do Banco"
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

export default FormBanco;
