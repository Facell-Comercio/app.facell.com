import FormInput from "@/components/custom/FormInput";
import { Form } from "@/components/ui/form";
import { Toggle } from "@/components/ui/toggle";
import { useCadastros } from "@/hooks/marketing/useCadastros";
import { UserProps } from "@/hooks/useUsers";
import ModalUsers from "@/pages/financeiro/components/ModalUsers";
import { useEffect, useState } from "react";
import { useFormVendedorData } from "./form-data";
import { VendedorSchema } from "./Modal";
import { useStoreVendedor } from "./store";

const FormVendedor = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: VendedorSchema;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const {
    mutate: insertOne,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
    isError: insertIsError,
  } = useCadastros().insertOneVendedor();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
    isError: updateIsError,
  } = useCadastros().updateVendedor();
  const [modalEditing, editModal, closeModal, editIsPending] = useStoreVendedor((state) => [
    state.modalEditing,
    state.editModal,
    state.closeModal,
    state.editIsPending,
    state.isPending,
  ]);
  const { form } = useFormVendedorData(data);
  const [modalUsersOpen, setModalUsersOpen] = useState<boolean>(false);

  const onSubmitData = (data: VendedorSchema) => {
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

  async function handleSelectionUser(user: UserProps) {
    form.setValue("id_user", String(user.id) || "");
    form.setValue("nome", user?.nome || "");
  }
  // ! Verificar a existênicia de erros
  // console.log(form.formState.errors);
  const isActive = !!+(form.watch("active") || 0);

  return (
    <div className="max-w-full overflow-x-hidden">
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
          <div className="max-w-full flex flex-col items-end lg:flex-row gap-3">
            {/* Primeira coluna */}
            <FormInput
              className="flex-1 min-w-[20ch]"
              name="nome"
              disabled={!modalEditing}
              readOnly
              onClick={() => setModalUsersOpen(true)}
              label="Nome"
              control={form.control}
            />
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Ativo</label>
              <Toggle
                variant={"active"}
                className="w-full min-w-[10ch]"
                pressed={isActive}
                disabled={!modalEditing}
                onPressedChange={(value) => form.setValue("active", Number(!!value))}
              >
                {isActive ? "ON" : "OFF"}
              </Toggle>
            </div>
          </div>
        </form>
        <ModalUsers
          open={modalUsersOpen}
          onOpenChange={() => setModalUsersOpen(false)}
          handleSelection={handleSelectionUser}
        />
      </Form>
    </div>
  );
};

export default FormVendedor;
