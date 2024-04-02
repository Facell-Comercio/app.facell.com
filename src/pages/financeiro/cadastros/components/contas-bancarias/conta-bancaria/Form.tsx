import FormInput from "@/components/custom/FormInput";
import FormSelect from "@/components/custom/FormSelect";
import FormSwitch from "@/components/custom/FormSwitch";
import SelectBanco from "@/components/custom/SelectBanco";
import SelectFilial from "@/components/custom/SelectFilial";
import { Form } from "@/components/ui/form";
import { useContasBancarias } from "@/hooks/useContasBancarias";
import { Fingerprint, Info } from "lucide-react";
import { ContaBancariaSchema } from "./Modal";
import { useFormContaBancariaData } from "./form-data";
import { useStoreContaBancaria } from "./store";

const FormContaBancaria = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: ContaBancariaSchema;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  console.log("RENDER - ContaBancaria:", id);
  const { mutate: insertOne } = useContasBancarias().insertOne();
  const { mutate: update } = useContasBancarias().update();
  const modalEditing = useStoreContaBancaria().modalEditing;
  const editModal = useStoreContaBancaria().editModal;
  const closeModal = useStoreContaBancaria().closeModal;

  const onSubmitData = (data: ContaBancariaSchema) => {
    console.log(data);

    if (id) update(data);
    if (!id) insertOne(data);

    editModal(false);
    closeModal();
  };

  const { form } = useFormContaBancariaData(data);
  console.log(form.watch("id_tipo_conta"));

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
                      Identificação da Conta
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
                    className="flex-1 min-w-[40ch]"
                    name="descricao"
                    readOnly={!modalEditing}
                    label="Descrição"
                    control={form.control}
                  />
                  <SelectFilial
                    className="min-w-32"
                    name="id_filial"
                    disabled={!modalEditing}
                    label="Filial"
                    control={form.control}
                  />
                  <SelectBanco
                    className="min-w-32"
                    name="id_banco"
                    disabled={!modalEditing}
                    label="Banco"
                    control={form.control}
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Info />{" "}
                  <span className="text-lg font-bold ">Informações Conta</span>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <FormInput
                    className="flex-1 min-w-[5ch]"
                    label="AG"
                    readOnly={!modalEditing}
                    name="agencia"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[5ch]"
                    name="dv_agencia"
                    readOnly={!modalEditing}
                    label="DvAg"
                    control={form.control}
                  />
                  <FormSelect
                    name="id_tipo_conta"
                    disabled={!modalEditing}
                    control={form.control}
                    label={"Tipo de conta"}
                    className="flex-1 min-w-[20ch]"
                    options={[
                      { value: "1", label: "CORRENTE" },
                      { value: "2", label: "POUPANÇA" },
                    ]}
                  />
                  <FormInput
                    className="flex-1 min-w-[5ch]"
                    name="conta"
                    readOnly={!modalEditing}
                    label="Conta"
                    control={form.control}
                  />
                  <FormInput
                    name="dv_conta"
                    className="flex-1 min-w-[5ch]"
                    readOnly={!modalEditing}
                    label="DvCt"
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

export default FormContaBancaria;
