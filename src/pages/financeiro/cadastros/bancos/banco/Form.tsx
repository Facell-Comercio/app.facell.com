import FormInput from "@/components/custom/FormInput";
import { Form } from "@/components/ui/form";
import { useBancos } from "@/hooks/financeiro/useBancos";
import ModalFornecedores, {
  ItemFornecedor,
} from "@/pages/financeiro/components/ModalFornecedores";
import { Contact } from "lucide-react";
import { useEffect, useState } from "react";
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
  const {
    mutate: insertOne,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
    isError: insertIsError,
  } = useBancos().insertOne();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
    isError: updateIsError,
  } = useBancos().update();
  const [modalEditing, editModal, closeModal, editIsPending] = useStoreBanco(
    (state) => [
      state.modalEditing,
      state.editModal,
      state.closeModal,
      state.editIsPending,
      state.isPending,
    ]
  );
  const [modalFornecedorOpen, setModalFornecedorOpen] =
    useState<boolean>(false);
  const { form } = useFormBancoData(data);

  const onSubmitData = (data: BancoSchema) => {
    if (id) update(data);
    if (!id) insertOne(data);
    // console.log(data);
  };

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

  async function handleSelectionFornecedor(item: ItemFornecedor) {
    form.setValue("id_fornecedor", String(item.id) || "");
    form.setValue("nome_fornecedor", String(item.nome) || "");
    setModalFornecedorOpen(false);
  }

  // ! Verificar a existênicia de erros
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
                    disabled={!modalEditing}
                    label="Código do Banco"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[40ch] shrink-0"
                    name="nome"
                    disabled={!modalEditing}
                    label="Nome do Banco"
                    control={form.control}
                  />
                  <span onClick={() => setModalFornecedorOpen(true)}>
                    <FormInput
                      className="flex-1 min-w-full sm:min-w-[30ch] shrink-0"
                      name="nome_fornecedor"
                      inputClass="min-w-full"
                      placeholder="SELECIONE O FORNECEDOR"
                      disabled={!modalEditing}
                      label="Nome do fornecedor"
                      control={form.control}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
      <ModalFornecedores
        open={modalEditing && modalFornecedorOpen}
        handleSelection={handleSelectionFornecedor}
        onOpenChange={() => setModalFornecedorOpen((prev) => !prev)}
      />
    </div>
  );
};

export default FormBanco;
