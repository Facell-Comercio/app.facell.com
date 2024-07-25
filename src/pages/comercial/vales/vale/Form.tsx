import FormDateInput from "@/components/custom/FormDate";
import FormInput from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { normalizeDate } from "@/helpers/mask";
import { ValeProps } from "@/hooks/comercial/useVales";
import ModalFiliais from "@/pages/admin/components/ModalFiliais";
import { Filial } from "@/types/filial-type";
import { Edit2, Info, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { TbCurrencyReal } from "react-icons/tb";
import { useFormValeData } from "./form-data";
import { useStoreVale } from "./store";

const FormVale = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: ValeProps;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  // const {
  //   mutate: insertOne,
  //   isPending: insertIsPending,
  //   isSuccess: insertIsSuccess,
  //   isError: insertIsError,
  // } = useCartoes().insertOne();
  // const {
  //   mutate: update,
  //   isPending: updateIsPending,
  //   isSuccess: updateIsSuccess,
  //   isError: updateIsError,
  // } = useCartoes().update();

  const [modalEditing, editModal, closeModal, editIsPending, isPending] =
    useStoreVale((state) => [
      state.modalEditing,
      state.editModal,
      state.closeModal,
      state.editIsPending,
      state.isPending,
    ]);
  const [modalFilialOpen, setModalFilialOpen] = useState<boolean>(false);

  const { form } = useFormValeData(data);

  const rowsAbatimentos = data?.abatimentos || [];

  const onSubmitData = (data: ValeProps) => {
    // if (id) update(data);
    // if (!id) insertOne(data);
    // console.log(data);
  };

  // useEffect(() => {
  //   if (updateIsSuccess || insertIsSuccess) {
  //     editModal(false);
  //     closeModal();
  //     editIsPending(false);
  //   } else if (updateIsError || insertIsError) {
  //     editIsPending(false);
  //   } else if (updateIsPending || insertIsPending) {
  //     editIsPending(true);
  //   }
  // }, [updateIsPending, insertIsPending]);

  // ! Verificar a existênicia de erros
  // console.log(form.formState.errors);

  function handleSelectFilial(filial: Filial) {
    form.setValue("id_filial", filial.id || "");
    form.setValue("filial", filial.nome);
  }

  const disabled = !modalEditing;

  return (
    <div className="max-w-full overflow-x-hidden">
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmitData)}
          className="max-w-screen-xl w-full grid grid-cols-1 z-[100]"
        >
          <div className="overflow-auto scroll-thin z-[100] flex flex-col gap-3 max-w-full h-full max-h-[72vh] sm:max-h-[70vh] col-span-2">
            {/* Primeira seção */}
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Info />
                    <span className="text-lg font-bold ">Dados do Vale</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-end">
                  <FormInput
                    className="flex-1 min-w-[30ch] shrink-0"
                    name="cpf_colaborador"
                    disabled={disabled}
                    label="CPF Colaborador"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[30ch] sm:min-w-[45ch] shrink-0"
                    name="nome_colaborador"
                    disabled={disabled}
                    label="Nome Colaborador"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-full sm:min-w-[30ch] shrink-0"
                    name="filial"
                    inputClass="min-w-full"
                    placeholder="SELECIONE A FILIAL"
                    disabled={disabled}
                    readOnly
                    label="Filial"
                    control={form.control}
                    onClick={() => setModalFilialOpen(true)}
                  />
                  <FormDateInput
                    disabled={disabled}
                    name="data_inicio_cobranca"
                    label="Início Cobrança"
                    control={form.control}
                    className="flex-1 min-w-[15ch]"
                  />
                  <FormInput
                    className="flex-1 min-w-[30ch] shrink-0"
                    name="origem"
                    disabled={disabled}
                    label="Origem"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[10ch]"
                    name="parcelas"
                    disabled={disabled}
                    label="Qtde Parcelas"
                    type="number"
                    min={1}
                    step="1"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[10ch]"
                    name="parcela"
                    disabled={disabled}
                    label="Parcela"
                    type="number"
                    min={1}
                    step="1"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[30ch]"
                    name="valor_parcela"
                    disabled={disabled}
                    label="Valor Parcela"
                    type="number"
                    min={0}
                    step="0.01"
                    icon={TbCurrencyReal}
                    iconLeft
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[30ch]"
                    name="saldo"
                    disabled={disabled}
                    label="Saldo"
                    type="number"
                    min={0}
                    step="0.01"
                    icon={TbCurrencyReal}
                    iconLeft
                    control={form.control}
                  />
                  <FormInput
                    className="min-w-full shrink-0"
                    name="obs"
                    disabled={disabled}
                    label="Observação"
                    control={form.control}
                  />
                </div>
              </div>
            </div>

            {/* Segunda seção */}
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Info />
                    <span className="text-lg font-bold ">Abatimentos</span>
                  </div>
                  <Button
                    variant={"tertiary"}
                    disabled={disabled}
                    className="flex gap-2"
                  >
                    <Plus /> Novo Abatimento
                  </Button>
                </div>

                <Table
                  className={`bg-background rounded-sm pb-2 ${
                    disabled && "opacity-65"
                  }`}
                >
                  <TableHeader>
                    <TableRow className="font-medium uppercase">
                      <TableCell>Ações</TableCell>
                      <TableCell>Data</TableCell>
                      <TableCell>Observações</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Abatido Por</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rowsAbatimentos.map((abatimento) => (
                      <TableRow key={abatimento.id}>
                        <TableCell className="flex gap-1">
                          <Button
                            variant={"warning"}
                            size={"xs"}
                            disabled={disabled}
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            variant={"destructive"}
                            size={"xs"}
                            disabled={disabled}
                          >
                            <Trash size={16} />
                          </Button>
                        </TableCell>
                        <TableCell>
                          {normalizeDate(abatimento.created_at || "")}
                        </TableCell>
                        <TableCell>{abatimento.obs}</TableCell>
                        <TableCell>{abatimento.valor}</TableCell>
                        <TableCell>{abatimento.criador}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </form>
      </Form>
      <ModalFiliais
        open={modalFilialOpen}
        handleSelection={handleSelectFilial}
        onOpenChange={setModalFilialOpen}
        closeOnSelection
      />
    </div>
  );
};

export default FormVale;
