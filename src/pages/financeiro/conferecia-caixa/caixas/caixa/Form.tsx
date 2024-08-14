import { Form } from "@/components/ui/form";
import {
  ConferenciasCaixaSchema,
  useConferenciasCaixa,
} from "@/hooks/financeiro/useConferenciasCaixa";
import { useEffect } from "react";
import CaixaCards from "./CaixaCards";
import { useFormCaixaData } from "./form-data";
import RowVirtualizedFixedMovimentoCaixa from "./RowVirtualizedMovimentoCaixa";
import StatusCaixa from "./StatusCaixa";
import { useStoreCaixa } from "./store";

const FormCaixa = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: ConferenciasCaixaSchema;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const {
    mutate: insertOne,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
    isError: insertIsError,
  } = useConferenciasCaixa().insertOne();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
    isError: updateIsError,
  } = useConferenciasCaixa().update();

  const [modalEditing, editModal, closeModal, editIsPending, isPending] =
    useStoreCaixa((state) => [
      state.modalEditing,
      state.editModal,
      state.closeModal,
      state.editIsPending,
      state.isPending,
    ]);

  const { form } = useFormCaixaData(data);

  const onSubmitData = (data: ConferenciasCaixaSchema) => {
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

  // ! Verificar a existênicia de erros
  // console.log(form.formState.errors);

  return (
    <div className="max-w-full overflow-x-hidden">
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmitData)}
          className="max-w-screen-xl w-full grid grid-cols-1 z-[100]"
        >
          <div className="overflow-auto scroll-thin z-[100] flex flex-col gap-3 max-w-full h-full max-h-[72vh] sm:max-h-[70vh] col-span-2">
            {/* Primeira coluna */}
            <StatusCaixa data={data} />
            <CaixaCards data={data} />
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg overflow-auto ">
                <RowVirtualizedFixedMovimentoCaixa
                  data={new Array(20).fill({ id: 1 })}
                />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormCaixa;
