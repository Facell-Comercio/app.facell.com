import AlertPopUp from "@/components/custom/AlertPopUp";
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
import { checkUserPermission } from "@/helpers/checkAuthorization";
import { normalizeDate } from "@/helpers/mask";
import { useVales, ValeProps } from "@/hooks/comercial/useVales";
import ModalFiliais from "@/pages/admin/components/ModalFiliais";
import { Filial } from "@/types/filial-type";
import { addMonths } from "date-fns";
import { Edit2, Info, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { TbCurrencyReal } from "react-icons/tb";
import { CustomCombobox } from "../../../../components/custom/CustomCombobox";
import ModalColaboradores, {
  ItemColaboradores,
} from "../../components/ModalColaboradores";
import { useFormValeData } from "./form-data";
import ModalAbatimento from "./ModalAbatimento";
import { useStoreVale } from "./store";

const defaultValuesOrigem = [
  {
    value: "AUDITORIA LOGISTICA",
    label: "AUDITORIA LOGISTICA",
  },
  {
    value: "AUDITORIA QUALIDADE",
    label: "AUDITORIA QUALIDADE",
  },
];

const FormVale = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: ValeProps;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const {
    mutate: insertOne,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
    isError: insertIsError,
  } = useVales().insertOne();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
    isError: updateIsError,
  } = useVales().update();
  /*  
    Itens atualizados
      - CPF
      - NOME COLABORADOR
      - FILIAL
      - INÍCIO COBRANÇA
      - ORIGEM
      - OBSERVAÇÃO
  **/
  const { mutate: deleteAbatimento } = useVales().deleteAbatimento();

  const [
    modalEditing,
    editModal,
    closeModal,
    editIsPending,
    isPending,
    openModalAbatimento,
    editModalAbatimento,
  ] = useStoreVale((state) => [
    state.modalEditing,
    state.editModal,
    state.closeModal,
    state.editIsPending,
    state.isPending,
    state.openModalAbatimento,
    state.editModalAbatimento,
  ]);
  const [modalFilialOpen, setModalFilialOpen] = useState<boolean>(false);
  const [openModalColaboradores, setOpenModalColaboradores] =
    useState<boolean>(false);

  const { form } = useFormValeData(data);

  const rowsAbatimentos = data?.abatimentos || [];

  const readOnly = !checkUserPermission(["GERENCIAR_VALES", "MASTER"]);
  const disabled = (!modalEditing || isPending) && !readOnly;
  const saldo = parseFloat(form.watch("saldo") || "0");
  const parcela = parseFloat(form.watch("parcela") || "1");
  const parcelas = parseFloat(form.watch("parcelas") || "1");

  const onSubmitData = (data: ValeProps) => {
    if (id) update(data);
    if (!id) insertOne(data);
    // console.log(data);
  };

  function handleClickNewAbatimento() {
    openModalAbatimento("");
    editModalAbatimento(true);
  }

  useEffect(() => {
    if (updateIsSuccess) {
      editModal(false);
      closeModal();
      editIsPending(false);
    } else if (insertIsSuccess) {
      if (parcela !== parcelas) {
        form.setValue("parcela", String(parcela + 1));
        form.setValue(
          "data_inicio_cobranca",
          addMonths(form.watch("data_inicio_cobranca"), 1)
        );
      } else {
        editModal(false);
        closeModal();
      }
      editIsPending(false);
    } else if (updateIsError || insertIsError) {
      editIsPending(false);
    } else if (updateIsPending || insertIsPending) {
      editIsPending(true);
    }
  }, [updateIsPending, insertIsPending]);

  // ! Verificar a existênicia de erros
  // console.log(form.formState.errors);

  function handleSelectFilial(filial: Filial) {
    form.setValue("id_filial", filial.id || "");
    form.setValue("filial", filial.nome);
  }

  const handleSelectionColaboradores = (colaboradores: ItemColaboradores) => {
    form.setValue("id_colaborador", colaboradores.id);
    form.setValue("nome_colaborador", colaboradores.nome);
    form.setValue("cpf_colaborador", colaboradores.cpf);

    setOpenModalColaboradores(false);
  };

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
                    readOnly
                    label="CPF Colaborador"
                    control={form.control}
                    onClick={() => !disabled && setOpenModalColaboradores(true)}
                  />
                  <FormInput
                    className="flex-1 min-w-[30ch] sm:min-w-[45ch] shrink-0"
                    name="nome_colaborador"
                    disabled={disabled}
                    readOnly
                    label="Nome Colaborador"
                    control={form.control}
                    onClick={() => !disabled && setOpenModalColaboradores(true)}
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
                    onClick={() => !readOnly && setModalFilialOpen(true)}
                  />
                  <FormDateInput
                    disabled={disabled}
                    readOnly={readOnly}
                    name="data_inicio_cobranca"
                    label="Início Cobrança"
                    control={form.control}
                    className="flex-1 min-w-[15ch]"
                  />
                  <span className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Origem</label>
                    <CustomCombobox
                      value={form.watch("origem")}
                      onChange={(value) => form.setValue("origem", value)}
                      disabled={disabled}
                      readOnly={readOnly}
                      defaultValues={defaultValuesOrigem}
                      placeholder="Selecione a origem..."
                    />
                  </span>

                  <FormInput
                    className="flex-1 min-w-[10ch]"
                    name="parcelas"
                    disabled={disabled}
                    readOnly={!!id}
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
                    readOnly={!!id}
                    label="Parcela"
                    type="number"
                    min={1}
                    max={parcelas}
                    step="1"
                    control={form.control}
                  />
                  <span title={!saldo ? "Primeiro digite o saldo" : ""}>
                    <FormInput
                      className="flex-1 min-w-[30ch]"
                      name="valor_parcela"
                      disabled={disabled || !saldo}
                      readOnly
                      label="Valor Parcela"
                      type="number"
                      min={0}
                      max={saldo}
                      step="0.01"
                      icon={TbCurrencyReal}
                      iconLeft
                      control={form.control}
                    />
                  </span>
                  <FormInput
                    className="flex-1 min-w-[30ch]"
                    name="saldo"
                    disabled={disabled}
                    readOnly={!!id}
                    label="Saldo"
                    type="number"
                    min={0}
                    step="0.01"
                    icon={TbCurrencyReal}
                    iconLeft
                    control={form.control}
                    onChange={(e) => {
                      if (!id) form.setValue("valor_parcela", e.target.value);
                    }}
                  />
                  <FormInput
                    className="min-w-full shrink-0"
                    name="obs"
                    disabled={disabled}
                    readOnly={readOnly}
                    label="Observação"
                    control={form.control}
                  />
                </div>
              </div>
            </div>

            {/* Segunda seção */}
            {!!id && (
              <div className="flex flex-1 flex-col gap-3 shrink-0">
                <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                  <div className="flex justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Info />
                      <span className="text-lg font-bold ">Abatimentos</span>
                    </div>
                    {checkUserPermission(["GERENCIAR_VALES", "MASTER"]) && (
                      <Button
                        variant={"tertiary"}
                        disabled={disabled}
                        className="flex gap-2"
                        onClick={() => handleClickNewAbatimento()}
                      >
                        <Plus /> Novo Abatimento
                      </Button>
                    )}
                  </div>

                  <Table
                    className={`bg-background rounded-sm pb-2 ${
                      disabled && !readOnly && "opacity-65"
                    }`}
                  >
                    <TableHeader>
                      <TableRow className="font-medium uppercase">
                        {!readOnly && <TableCell>Ações</TableCell>}
                        <TableCell>Data</TableCell>
                        <TableCell>Observações</TableCell>
                        <TableCell>Valor</TableCell>
                        <TableCell>Abatido Por</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rowsAbatimentos.map((abatimento) => (
                        <TableRow key={abatimento.id}>
                          {!readOnly && (
                            <TableCell className="flex gap-1">
                              <Button
                                variant={"warning"}
                                size={"xs"}
                                disabled={disabled}
                                onClick={() =>
                                  openModalAbatimento(abatimento.id || "")
                                }
                              >
                                <Edit2 size={16} />
                              </Button>
                              <AlertPopUp
                                title={"Deseja realmente excluir"}
                                description="Essa ação não pode ser desfeita. O abatimento será excluído definitivamente do servidor."
                                action={() => {
                                  deleteAbatimento(abatimento.id);
                                }}
                              >
                                <Button
                                  variant={"destructive"}
                                  size={"xs"}
                                  disabled={disabled}
                                >
                                  <Trash size={16} />
                                </Button>
                              </AlertPopUp>
                            </TableCell>
                          )}
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
            )}
          </div>
        </form>
      </Form>
      <ModalFiliais
        open={modalFilialOpen}
        handleSelection={handleSelectFilial}
        onOpenChange={setModalFilialOpen}
        closeOnSelection
      />
      <ModalColaboradores
        handleSelection={handleSelectionColaboradores}
        open={openModalColaboradores}
        // @ts-ignore
        onOpenChange={setOpenModalColaboradores}
      />
      <ModalAbatimento saldo={form.watch("saldo")} />
    </div>
  );
};

export default FormVale;
