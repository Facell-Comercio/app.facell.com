import { DataTable } from "@/components/custom/DataTable";
import FormInput from "@/components/custom/FormInput";
import FormSwitch from "@/components/custom/FormSwitch";
import SelectMatriz from "@/components/custom/SelectMatriz";
import { Form } from "@/components/ui/form";
import { CartaoSchema, useCartoes } from "@/hooks/financeiro/useCartoes";
import ModalFornecedores, {
  ItemFornecedor,
} from "@/pages/financeiro/components/ModalFornecedores";
import { CreditCard, ReceiptText } from "lucide-react";
import { useEffect, useState } from "react";
import { TituloSchemaProps } from "../../titulos/titulo/form-data";
import { columnsTableFaturas } from "./columnsFaturas";
import { useFormCartaoData } from "./form-data";
import ModalFatura from "./ModalFatura";
import { useStoreCartao } from "./store";

export interface FaturasSchemmaProps extends TituloSchemaProps {
  id_fatura_cartao?: string | number;
}

const FormCartao = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: CartaoSchema;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const {
    mutate: insertOne,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
    isError: insertIsError,
  } = useCartoes().insertOne();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
    isError: updateIsError,
  } = useCartoes().update();
  const [
    modalEditing,
    editModal,
    closeModal,
    editIsPending,
    isPending,
    paginationFaturas,
    setPaginationFaturas,
  ] = useStoreCartao((state) => [
    state.modalEditing,
    state.editModal,
    state.closeModal,
    state.editIsPending,
    state.isPending,
    state.paginationFaturas,
    state.setPaginationFaturas,
  ]);
  const [modalFornecedorOpen, setModalFornecedorOpen] =
    useState<boolean>(false);

  const { form } = useFormCartaoData(data);
  const id_matriz = form.watch("id_matriz");

  const { data: dataFaturas, isLoading: isLoadingFaturas } =
    useCartoes().getOneFaturas({
      id,
      pagination: paginationFaturas,
    });

  const rowsFaturas = dataFaturas?.data?.rows || [];
  const rowCountFaturas = dataFaturas?.data?.rowCount || 0;

  const onSubmitData = (data: CartaoSchema) => {
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
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmitData)}
          className="max-w-screen-xl w-full grid grid-cols-1 z-[100]"
        >
          <div className="overflow-auto scroll-thin z-[100] flex flex-col gap-3 max-w-full h-full max-h-[72vh] sm:max-h-[70vh] col-span-2">
            {/* Primeira coluna */}
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <CreditCard />
                    <span className="text-lg font-bold ">Dados do Cartão</span>
                  </div>
                  <FormSwitch
                    name="active"
                    disabled={!modalEditing || isPending}
                    label="Ativo"
                    control={form.control}
                  />
                </div>

                <div className="flex flex-wrap gap-2 items-end">
                  <div className="flex gap-2 flex-col">
                    <label className="text-sm font-semibold">Matriz</label>
                    <SelectMatriz
                      value={id_matriz}
                      disabled={!modalEditing}
                      onChange={(id_matriz) => {
                        form.setValue("id_matriz", id_matriz || "");
                      }}
                    />
                  </div>

                  <FormInput
                    className="flex-1 min-w-[30ch] shrink-0"
                    name="nome_portador"
                    disabled={!modalEditing}
                    label="Nome do Portador"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[20ch] shrink-0"
                    name="dia_vencimento"
                    disabled={!modalEditing}
                    label="Dia do vencimento"
                    type="number"
                    min={1}
                    max={31}
                    step="1"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[20ch] shrink-0"
                    name="dia_corte"
                    disabled={!modalEditing}
                    label="Dia de Corte"
                    type="number"
                    min={1}
                    max={31}
                    step="1"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[30ch]"
                    name="descricao"
                    disabled={!modalEditing}
                    label="Descrição"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-full sm:min-w-[30ch] shrink-0"
                    name="nome_fornecedor"
                    inputClass="min-w-full"
                    placeholder="SELECIONE O FORNECEDOR"
                    disabled={!modalEditing}
                    label="Nome do fornecedor"
                    control={form.control}
                    onClick={() => setModalFornecedorOpen(true)}
                  />
                </div>
              </div>
            </div>

            {!!id && (
              <div className="max-w-full p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <ReceiptText />{" "}
                    <span className="text-lg font-bold ">Faturas</span>
                  </div>
                </div>
                <section className="bg-background rounded-md">
                  <DataTable
                    pagination={paginationFaturas}
                    setPagination={setPaginationFaturas}
                    data={rowsFaturas}
                    rowCount={rowCountFaturas}
                    columns={columnsTableFaturas}
                    isLoading={isLoadingFaturas}
                  />
                </section>
              </div>
            )}
          </div>
        </form>
      </Form>
      <ModalFornecedores
        open={modalEditing && modalFornecedorOpen}
        handleSelection={handleSelectionFornecedor}
        onOpenChange={() => setModalFornecedorOpen((prev) => !prev)}
      />
      <ModalFatura />
    </div>
  );
};

export default FormCartao;
