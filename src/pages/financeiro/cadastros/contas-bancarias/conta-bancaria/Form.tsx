import FormInput from "@/components/custom/FormInput";
import FormSelect from "@/components/custom/FormSelect";
import FormSwitch from "@/components/custom/FormSwitch";
import SelectFilial from "@/components/custom/SelectFilial";
import { Form } from "@/components/ui/form";
import { useContasBancarias } from "@/hooks/financeiro/useContasBancarias";
import ModalBancos, {
  ItemBancos,
} from "@/pages/financeiro/components/ModalBancos";
import { Fingerprint, Info } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [modalBancosOpen, setModalBancosOpen] = useState<boolean>(false);
  const {
    mutate: insertOne,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
    isError: insertIsError,
  } = useContasBancarias().insertOne();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
    isError: updateIsError,
  } = useContasBancarias().update();

  const [modalEditing, editModal, closeModal, editIsPending, isPending] =
    useStoreContaBancaria((state) => [
      state.modalEditing,
      state.editModal,
      state.closeModal,
      state.editIsPending,
      state.isPending,
    ]);

  const onSubmitData = (data: ContaBancariaSchema) => {
    // console.log(data);

    if (id) update(data);
    if (!id) insertOne(data);
  };

  const { form } = useFormContaBancariaData(data);
  // console.log(form.watch("id_tipo_conta"));

  function handleSelectionBancos(item: ItemBancos) {
    form.setValue("id_banco", item.id);
    form.setValue("banco", item.codigo + " - " + item.nome);
    setModalBancosOpen(false);
  }

  useEffect(() => {
    if (updateIsSuccess || insertIsSuccess) {
      editModal(false);
      closeModal();
      editIsPending(false);
    } else if (updateIsError || insertIsError) {
      editIsPending(false);
    } else if (updateIsPending || insertIsPending) {
      editIsPending(true);
    }
  }, [updateIsPending, insertIsPending]);

  // ! Verificar a existênicia de erros
  // console.log(form.formState.errors);

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
                    disabled={!modalEditing || isPending}
                    label="Ativo"
                    control={form.control}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <FormInput name="id" type="hidden" control={form.control} />
                  <FormInput
                    className="flex-1 min-w-[40ch]"
                    name="descricao"
                    readOnly={!modalEditing || isPending}
                    label="Descrição"
                    control={form.control}
                  />
                  <SelectFilial
                    className="flex-1 min-w-32"
                    name="id_filial"
                    disabled={!modalEditing || isPending}
                    label="Filial"
                    control={form.control}
                  />
                  <FormInput
                    name="id_banco flex-1"
                    type="hidden"
                    control={form.control}
                  />
                  <span
                    onClick={() => setModalBancosOpen(true)}
                    className="flex-1"
                  >
                    <FormInput
                      className="flex-1 min-w-[40ch]"
                      name="banco"
                      readOnly={!modalEditing || isPending}
                      label="Banco"
                      placeholder="Selecione o banco"
                      control={form.control}
                    />
                  </span>
                  <ModalBancos
                    open={modalEditing && modalBancosOpen}
                    onOpenChange={() =>
                      setModalBancosOpen((prev: boolean) => !prev)
                    }
                    handleSelection={handleSelectionBancos}
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
                    label="Agência"
                    readOnly={!modalEditing || isPending}
                    name="agencia"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[5ch]"
                    name="dv_agencia"
                    readOnly={!modalEditing || isPending}
                    label="Dígito Agência"
                    control={form.control}
                  />
                  <FormSelect
                    name="id_tipo_conta"
                    disabled={!modalEditing || isPending}
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
                    readOnly={!modalEditing || isPending}
                    label="Conta"
                    control={form.control}
                  />
                  <FormInput
                    name="dv_conta"
                    className="flex-1 min-w-[5ch]"
                    readOnly={!modalEditing || isPending}
                    label="Dígito Conta"
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
