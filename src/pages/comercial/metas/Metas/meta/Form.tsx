import FormDateInput from "@/components/custom/FormDate";
import FormInput from "@/components/custom/FormInput";
import { Form } from "@/components/ui/form";
import ModalFiliais from "@/pages/admin/components/ModalFiliais";
import { Filial } from "@/types/filial-type";
import {
  Calendar,
  Crosshair,
  Percent,
  UserSearch,
} from "lucide-react";
import { useEffect, useState } from "react";

import FormSelect from "@/components/custom/FormSelect";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  MetasProps,
  useMetas,
} from "@/hooks/comercial/useMetas";
import { TbCurrencyReal } from "react-icons/tb";
import { useFormMetaData } from "./form-data";
import { useStoreMeta } from "./store";

const cargosPrevistos = [
  "FILIAL",
  "CONSULTOR DE VENDAS",
  "CONSULTOR DE VENDAS DIRETAS",
  "CONSULTOR DE VENDAS INDIRETAS",
];

const tags = ["BLUE", "EMBAIXADOR DE ACESSORIO"];

const FormMeta = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: MetasProps;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const {
    mutate: insertOne,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
    isError: insertIsError,
  } = useMetas().insertOne();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
    isError: updateIsError,
  } = useMetas().update();

  const [
    modalEditing,
    editModal,
    closeModal,
    editIsPending,
    isPending,
  ] = useStoreMeta((state) => [
    state.modalEditing,
    state.editModal,
    state.closeModal,
    state.editIsPending,
    state.isPending,
  ]);
  const [modalFilialOpen, setModalFilialOpen] =
    useState<boolean>(false);

  const { form } = useFormMetaData(data);

  const readOnly = !data.canEdit;

  const disabled =
    (!modalEditing || isPending) && !readOnly;

  const onSubmitData = (data: MetasProps) => {
    if (id) update(data);
    if (!id) insertOne(data);
  };

  useEffect(() => {
    if (updateIsSuccess || insertIsSuccess) {
      editModal(false);
      closeModal();
      editIsPending(false);
    } else if (updateIsError || insertIsError) {
      editIsPending(false);
    } else if (
      updateIsPending ||
      insertIsPending
    ) {
      editIsPending(true);
    }
  }, [updateIsPending, insertIsPending]);

  // ! Verificar a existênicia de erros
  // console.log(form.formState.errors);

  function handleSelectFilial(filial: Filial) {
    form.setValue("id_filial", filial.id || "");
    form.setValue("filial", filial.nome);
    form.setValue(
      "id_grupo_economico",
      filial.id_grupo_economico
    );
    form.setValue(
      "grupo_economico",
      filial.grupo_economico
    );
  }

  return (
    <div className="max-w-full overflow-x-hidden">
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(
            onSubmitData
          )}
          className="max-w-screen-xl w-full grid grid-cols-1 gap-3 "
        >
          <div className="overflow-auto scroll-thin  flex flex-col gap-3 max-w-full h-full max-h-[72vh] sm:max-h-[70vh] col-span-2">
            {/* Primeira seção */}
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Calendar />
                    <span className="text-lg font-bold ">
                      Competência
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-end">
                  <FormDateInput
                    disabled={disabled}
                    readOnly={readOnly}
                    name="ref"
                    label="Mês de Referência"
                    control={form.control}
                    className="flex-1 min-w-[20ch]"
                  />
                  <FormDateInput
                    disabled={disabled}
                    readOnly={readOnly}
                    name="ciclo"
                    label="Ciclo de Pagamento"
                    control={form.control}
                    className="flex-1 min-w-[20ch]"
                  />
                  <FormDateInput
                    disabled={disabled}
                    readOnly={readOnly}
                    name="data_inicial"
                    label="Data Inicial"
                    control={form.control}
                    className="flex-1 min-w-[20ch]"
                  />
                  <FormDateInput
                    disabled={disabled}
                    readOnly={readOnly}
                    name="data_final"
                    label="Data Final"
                    control={form.control}
                    className="flex-1 min-w-[20ch]"
                  />
                  <FormInput
                    type="number"
                    className="flex-1 min-w-[20ch] shrink-0"
                    name="proporcional"
                    disabled={disabled}
                    readOnly={readOnly}
                    label="Proporcional"
                    min={0}
                    control={form.control}
                    icon={Percent}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-auto scroll-thin  flex flex-col gap-3 max-w-full h-full max-h-[72vh] sm:max-h-[70vh] col-span-2">
            {/* Segunda seção */}
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <UserSearch />
                    <span className="text-lg font-bold ">
                      Responsável
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-end">
                  <FormInput
                    className="flex-1 shrink-0 min-w-fit"
                    name="nome"
                    disabled={disabled}
                    label="Nome"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 shrink-0 min-w-fit"
                    name="cpf"
                    disabled={disabled}
                    label="CPF"
                    control={form.control}
                  />

                  <FormInput
                    className="flex-1 shrink-0 min-w-fit"
                    name="filial"
                    inputClass="min-w-full"
                    placeholder="SELECIONE A FILIAL"
                    disabled={disabled}
                    readOnly
                    label="Filial"
                    control={form.control}
                    onClick={() =>
                      !readOnly &&
                      setModalFilialOpen(true)
                    }
                  />
                  <FormInput
                    className="flex-1 shrink-0 min-w-fit"
                    name="grupo_economico"
                    inputClass="min-w-full"
                    placeholder="SELECIONE A FILIAL"
                    disabled={disabled}
                    readOnly
                    label="Grupo Econômico"
                    control={form.control}
                  />
                  <FormSelect
                    name="cargo"
                    label="Cargo"
                    control={form.control}
                    disabled={
                      disabled || readOnly
                    }
                    placeholder="Selecione o cargo"
                    options={
                      cargosPrevistos.map(
                        (cargo: any) => ({
                          value: cargo,
                          label: cargo,
                        })
                      ) || []
                    }
                  />
                  <span className="flex gap-2 flex-col flex-1">
                    <label className="text-sm font-medium">
                      Tags
                    </label>

                    <MultiSelect
                      options={tags.map(
                        (tag: any) => ({
                          value: tag,
                          label: tag,
                        })
                      )}
                      onValueChange={(tag) => {
                        form.setValue(
                          "tags",
                          tag.join(";")
                        );
                      }}
                      disabled={
                        disabled || readOnly
                      }
                      defaultValue={
                        form
                          .watch("tags")
                          ?.split(";") || []
                      }
                      placeholder="Status"
                      variant="secondary"
                      animation={4}
                      maxCount={2}
                      className={`bg-background hover:bg-background`}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-auto scroll-thin  flex flex-col gap-3 max-w-full h-full max-h-[72vh] sm:max-h-[70vh] col-span-2">
            {/* Terceira seção */}
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Crosshair />
                    <span className="text-lg font-bold ">
                      Metas
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-end">
                  <div className="flex gap-2 flex-wrap w-full">
                    <FormInput
                      type="number"
                      className="flex-1 min-w-[20ch] shrink-0"
                      name="controle"
                      disabled={disabled}
                      readOnly={readOnly}
                      label="Controle"
                      min={0}
                      step={"1"}
                      control={form.control}
                    />
                    <FormInput
                      type="number"
                      className="flex-1 min-w-[20ch] shrink-0"
                      name="pos"
                      disabled={disabled}
                      readOnly={readOnly}
                      label="Pos"
                      min={0}
                      step={"1"}
                      control={form.control}
                    />
                    <FormInput
                      type="number"
                      className="flex-1 min-w-[20ch] shrink-0"
                      name="upgrade"
                      disabled={disabled}
                      readOnly={readOnly}
                      label="Upgrade"
                      min={0}
                      step={"1"}
                      control={form.control}
                    />
                  </div>

                  <div className="flex gap-2 flex-wrap w-full">
                    <FormInput
                      type="number"
                      className="flex-1 min-w-[20ch] shrink-0"
                      name="receita"
                      disabled={disabled}
                      readOnly={readOnly}
                      label="Receita"
                      min={0}
                      control={form.control}
                      icon={TbCurrencyReal}
                      iconLeft
                    />
                    <FormInput
                      type="number"
                      className="flex-1 min-w-[20ch] shrink-0"
                      name="acessorio"
                      disabled={disabled}
                      readOnly={readOnly}
                      label="Acessório"
                      min={0}
                      control={form.control}
                      icon={TbCurrencyReal}
                      iconLeft
                    />
                    <FormInput
                      type="number"
                      className="flex-1 min-w-[20ch] shrink-0"
                      name="pitzi"
                      disabled={disabled}
                      readOnly={readOnly}
                      label="Pitzi"
                      min={0}
                      control={form.control}
                      icon={TbCurrencyReal}
                      iconLeft
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap w-full">
                    <FormInput
                      type="number"
                      className="flex-1 min-w-[20ch] shrink-0"
                      name="fixo"
                      disabled={disabled}
                      readOnly={readOnly}
                      label="Fixo"
                      min={0}
                      step={"1"}
                      control={form.control}
                    />
                    <FormInput
                      type="number"
                      className="flex-1 min-w-[20ch] shrink-0"
                      name="wttx"
                      disabled={disabled}
                      readOnly={readOnly}
                      label="Wttx"
                      min={0}
                      step={"1"}
                      control={form.control}
                    />
                    <FormInput
                      type="number"
                      className="flex-1 min-w-[20ch] shrink-0"
                      name="live"
                      disabled={disabled}
                      readOnly={readOnly}
                      label="Live"
                      min={0}
                      step={"1"}
                      control={form.control}
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap w-full">
                    <FormInput
                      type="number"
                      className="flex-1 min-w-[20ch] shrink-0"
                      name="qtde_aparelho"
                      disabled={disabled}
                      readOnly={readOnly}
                      label="Qdte. Aparelho"
                      min={0}
                      step={"1"}
                      control={form.control}
                    />
                    <FormInput
                      type="number"
                      className="flex-1 min-w-[20ch] shrink-0"
                      name="aparelho"
                      disabled={disabled}
                      readOnly={readOnly}
                      label="Aparelho"
                      min={0}
                      control={form.control}
                    />
                  </div>
                </div>
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
        isLojaTim
        id_grupo_economico={form.watch(
          "id_grupo_economico"
        )}
      />
    </div>
  );
};

export default FormMeta;
