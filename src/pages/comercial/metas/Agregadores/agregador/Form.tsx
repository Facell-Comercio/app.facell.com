import FormDateInput from "@/components/custom/FormDate";
import FormInput from "@/components/custom/FormInput";
import { Form } from "@/components/ui/form";
import { hasPermission } from "@/helpers/checkAuthorization";
import ModalFiliais from "@/pages/admin/components/ModalFiliais";
import { Filial } from "@/types/filial-type";
import { Calendar, Crosshair, Percent, Plus, Trash, UserSearch } from "lucide-react";
import { useEffect, useState } from "react";

import AlertPopUp from "@/components/custom/AlertPopUp";
import FormSelect from "@/components/custom/FormSelect";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { normalizeCurrency } from "@/helpers/mask";
import { AgregadoresProps, useAgregadores } from "@/hooks/comercial/useAgregadores";
import { MetasProps } from "@/hooks/comercial/useMetas";
import ModalMetas from "@/pages/comercial/components/ModalMetas";
import { useStoreMetasAgregadores } from "../../store-metas-agregadores";
import { useFormAgregadorData } from "./form-data-agregador";
import { useStoreAgregador } from "./store-agregador";

//* Cargos Agregadores
const cargosPrevistos = [
  "CAIXA",
  "PROMOTOR DE ACESSORIO E PITZI",
  "GERENTE DE LOJA",
  "GERENTE GERAL DE LOJA",
  "SUPERVISOR DE PROCESSOS",
  "SUPERVISOR DE RELACIONAMENTO",
  "COORDENADOR COMERCIAL",
  "COORDENADOR DE COMPRAS",
  "GERENTE REGIONAL",
  "GERENTE DE VENDAS DIGITAIS",
];

const tiposAgregacao = ["FILIAL", "VENDEDOR"];

const tags = ["BLUE"];

const FormAgregador = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: AgregadoresProps;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const [modalMetasOpen, setModalMetasOpen] = useState<boolean>(false);
  const [mes, ano] = useStoreMetasAgregadores((state) => [state.mes, state.ano]);
  const {
    mutate: insertOne,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
    isError: insertIsError,
  } = useAgregadores().insertOne();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
    isError: updateIsError,
  } = useAgregadores().update();

  const [modalEditing, editModal, closeModal, editIsPending, isPending] = useStoreAgregador(
    (state) => [
      state.modalEditing,
      state.editModal,
      state.closeModal,
      state.editIsPending,
      state.isPending,
    ]
  );
  const [modalFilialOpen, setModalFilialOpen] = useState<boolean>(false);

  const { form, metas, appendMeta, removeMeta } = useFormAgregadorData(data);
  const metas_agregadas = form.watch("metas_agregadas");

  const readOnly = !hasPermission(["METAS:AGREGADORES_EDITAR", "MASTER"]);
  const disabled = (!modalEditing || isPending) && !readOnly;

  const onSubmitData = (data: AgregadoresProps) => {
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
    } else if (updateIsPending || insertIsPending) {
      editIsPending(true);
    }
  }, [updateIsPending, insertIsPending]);

  // ! Verificar a existênicia de erros
  // console.log(form.formState.errors);

  function handleSelectFilial(filial: Filial) {
    form.setValue("id_filial", filial.id || "");
    form.setValue("filial", filial.nome);
    form.setValue("id_grupo_economico", filial.id_grupo_economico);
    form.setValue("grupo_economico", filial.grupo_economico);
  }

  function handleSelectMetas(metas: MetasProps[]) {
    if (data) {
      const newMetas = [];
      if (data.metas_agregadas) {
        newMetas.push(...data.metas_agregadas?.split(";"));
      }
      newMetas.push(...metas.map((meta) => meta.cpf));
      form.setValue("metas_agregadas", newMetas.join(";"));

      appendMeta(metas);
    }
  }

  return (
    <div className="max-w-full overflow-x-hidden">
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmitData)}
          className="max-w-screen-xl w-full grid grid-cols-1 gap-3 "
        >
          <div className="flex flex-col gap-3 max-w-full h-full col-span-2">
            {/* Primeira seção */}
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Calendar />
                    <span className="text-lg font-bold ">Competência</span>
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
                    label="Proporcional"
                    readOnly={readOnly}
                    min={0}
                    control={form.control}
                    icon={Percent}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 max-w-full h-full col-span-2">
            {/* Segunda seção */}
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <UserSearch />
                    <span className="text-lg font-bold ">Responsável</span>
                  </div>
                </div>

                <div className="flex gap-2 items-end flex-wrap">
                  <FormInput
                    className="flex-1 shrink-0 min-w-full sm:min-w-[20ch]"
                    name="nome"
                    disabled={disabled}
                    readOnly={readOnly}
                    label="Nome"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 shrink-0 min-w-full sm:min-w-[20ch]"
                    name="cpf"
                    disabled={disabled}
                    readOnly={readOnly}
                    label="CPF"
                    control={form.control}
                  />

                  <FormInput
                    className="flex-1 shrink-0 min-w-full sm:min-w-[20ch]"
                    name="filial"
                    inputClass="min-w-full"
                    placeholder="SELECIONE A FILIAL"
                    disabled={disabled}
                    readOnly
                    label="Filial"
                    control={form.control}
                    onClick={() => !readOnly && setModalFilialOpen(true)}
                  />
                  <FormInput
                    className="flex-1 shrink-0 min-w-full sm:min-w-[20ch]"
                    name="grupo_economico"
                    inputClass="min-w-full"
                    placeholder="SELECIONE A FILIAL"
                    disabled={disabled}
                    readOnly
                    label="Grupo Econômico"
                    control={form.control}
                  />
                  <FormSelect
                    name="tipo_agregacao"
                    label="Tipo de Agregação"
                    selectClassName="min-w-full sm:min-w-[20ch]"
                    control={form.control}
                    disabled={disabled}
                    readOnly={readOnly}
                    placeholder="Selecione o tipo de agregação"
                    options={
                      tiposAgregacao.map((tipo_agregacao: any) => ({
                        value: tipo_agregacao,
                        label: tipo_agregacao,
                      })) || []
                    }
                    onChange={() => {
                      form.setValue("metas_agregadas", "");
                      form.setValue("metas", []);
                    }}
                  />
                  {/* <span className="flex gap-2 flex-col flex-1">
                    <label className="text-sm font-medium">Tags</label>

                    <MultiSelect
                      options={tags.map((tag: any) => ({
                        value: tag,
                        label: tag,
                      }))}
                      onValueChange={(tag) => {
                        form.setValue("tags", tag.join(";"));
                      }}
                      disabled={disabled || readOnly}
                      defaultValue={form.watch("tags")?.split(";") || []}
                      placeholder="Status"
                      variant="secondary"
                      animation={4}
                      maxCount={2}
                      className={`bg-background hover:bg-background`}
                    />
                  </span> */}

                  <FormSelect
                    name="cargo"
                    label="Cargo"
                    selectClassName="min-w-full sm:min-w-[20ch]"
                    control={form.control}
                    disabled={disabled}
                    readOnly={readOnly}
                    placeholder="Selecione o cargo"
                    options={
                      cargosPrevistos.map((cargo: any) => ({
                        value: cargo,
                        label: cargo,
                      })) || []
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          {id && (
            <div className="flex flex-col gap-3 max-w-full h-full col-span-2">
              {/* Terceira seção */}
              <div className="flex flex-1 flex-col gap-3 shrink-0">
                <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                  <div className="flex justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Crosshair />
                      <span className="text-lg font-bold">Metas</span>
                    </div>
                    {hasPermission(["GERENCIAR_VALES", "MASTER"]) && (
                      <div className="flex gap-2 flex-wrap">
                        {hasPermission(["METAS:AGREGADORES_EDITAR", "MASTER"]) && (
                          <AlertPopUp
                            title={"Deseja realmente remover todas as metas"}
                            action={() => {
                              form.setValue("metas_agregadas", "");
                              form.setValue("metas", []);
                            }}
                          >
                            <Button
                              variant={"destructive"}
                              className="flex gap-2"
                              disabled={disabled}
                            >
                              <Trash size={16} /> Remover Todas
                            </Button>
                          </AlertPopUp>
                        )}
                        {hasPermission(["METAS:AGREGADORES_CRIAR", "MASTER"]) && (
                          <Button
                            variant={"tertiary"}
                            disabled={disabled}
                            className="flex gap-2"
                            onClick={() => setModalMetasOpen(true)}
                          >
                            <Plus /> Nova Meta
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  <Table
                    className={`bg-background rounded-sm pb-2 ${
                      disabled && !readOnly && "opacity-65"
                    }`}
                  >
                    <TableHeader>
                      <TableRow>
                        {!readOnly && <TableHead>Ação</TableHead>}
                        <TableHead className="text-nowrap">Filial</TableHead>
                        <TableHead className="text-nowrap">Cargo</TableHead>
                        <TableHead className="text-nowrap">Nome</TableHead>
                        <TableHead className="text-nowrap">Controle</TableHead>
                        <TableHead className="text-nowrap">Pos</TableHead>
                        <TableHead className="text-nowrap">Upgrade</TableHead>
                        <TableHead className="text-nowrap">Receita</TableHead>
                        <TableHead className="text-nowrap">Qtde. Aparelho</TableHead>
                        <TableHead className="text-nowrap">Aparelho</TableHead>
                        <TableHead className="text-nowrap">Acessório</TableHead>
                        <TableHead className="text-nowrap">Pitzi</TableHead>
                        <TableHead className="text-nowrap">Fixo</TableHead>
                        <TableHead className="text-nowrap">WTTX</TableHead>
                        <TableHead className="text-nowrap">Live</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {metas?.map((meta, index) => (
                        <TableRow key={`AGREGADOR - ${index} - ${meta.id}`}>
                          {!readOnly && (
                            <TableCell className="flex gap-1">
                              <AlertPopUp
                                title={"Deseja realmente remover"}
                                description="Essa ação não pode ser desfeita. A meta será removida do agregador."
                                action={() => {
                                  removeMeta(index);
                                  const filteredMetasAgregadas = metas_agregadas
                                    ?.split(";")
                                    .filter((meta_agregada) => meta_agregada !== meta.cpf);

                                  form.setValue(
                                    "metas_agregadas",
                                    filteredMetasAgregadas?.join(";")
                                  );
                                }}
                              >
                                <Button
                                  className="flex-1"
                                  variant={"destructive"}
                                  size={"xs"}
                                  disabled={disabled}
                                >
                                  <Trash size={16} />
                                </Button>
                              </AlertPopUp>
                            </TableCell>
                          )}
                          <TableCell className="text-nowrap">{meta.filial}</TableCell>
                          <TableCell className="text-nowrap">{meta.cargo}</TableCell>
                          <TableCell className="text-nowrap">{meta.nome}</TableCell>
                          <TableCell className="text-nowrap">{meta.controle}</TableCell>
                          <TableCell className="text-nowrap">{meta.pos}</TableCell>
                          <TableCell className="text-nowrap">{meta.upgrade}</TableCell>
                          <TableCell className="text-nowrap">
                            {normalizeCurrency(meta.receita)}
                          </TableCell>
                          <TableCell className="text-nowrap">{meta.qtde_aparelho}</TableCell>
                          <TableCell className="text-nowrap">
                            {normalizeCurrency(meta.aparelho)}
                          </TableCell>
                          <TableCell className="text-nowrap">
                            {normalizeCurrency(meta.acessorio)}
                          </TableCell>
                          <TableCell className="text-nowrap">
                            {normalizeCurrency(meta.pitzi)}
                          </TableCell>
                          <TableCell className="text-nowrap">{meta.fixo}</TableCell>
                          <TableCell className="text-nowrap">{meta.wttx}</TableCell>
                          <TableCell className="text-nowrap">{meta.live}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell className="text-nowrap">
                          {metas?.reduce(
                            (prev, meta) => prev + parseFloat(meta.controle || "0"),
                            0
                          )}
                        </TableCell>
                        <TableCell className="text-nowrap">
                          {metas?.reduce((prev, meta) => prev + parseFloat(meta.pos || "0"), 0)}
                        </TableCell>
                        <TableCell className="text-nowrap">
                          {metas?.reduce((prev, meta) => prev + parseFloat(meta.upgrade || "0"), 0)}
                        </TableCell>
                        <TableCell className="text-nowrap">
                          {normalizeCurrency(
                            metas?.reduce((prev, meta) => prev + parseFloat(meta.receita || "0"), 0)
                          )}
                        </TableCell>
                        <TableCell className="text-nowrap">
                          {metas?.reduce(
                            (prev, meta) => prev + parseFloat(meta.qtde_aparelho || "0"),
                            0
                          )}
                        </TableCell>
                        <TableCell className="text-nowrap">
                          {normalizeCurrency(
                            metas?.reduce(
                              (prev, meta) => prev + parseFloat(meta.aparelho || "0"),
                              0
                            )
                          )}
                        </TableCell>
                        <TableCell className="text-nowrap">
                          {normalizeCurrency(
                            metas?.reduce(
                              (prev, meta) => prev + parseFloat(meta.acessorio || "0"),
                              0
                            )
                          )}
                        </TableCell>
                        <TableCell className="text-nowrap">
                          {normalizeCurrency(
                            metas?.reduce((prev, meta) => prev + parseFloat(meta.pitzi || "0"), 0)
                          )}
                        </TableCell>
                        <TableCell className="text-nowrap">
                          {metas?.reduce((prev, meta) => prev + parseFloat(meta.fixo || "0"), 0)}
                        </TableCell>
                        <TableCell className="text-nowrap">
                          {metas?.reduce((prev, meta) => prev + parseFloat(meta.wttx || "0"), 0)}
                        </TableCell>
                        <TableCell className="text-nowrap">
                          {metas?.reduce((prev, meta) => prev + parseFloat(meta.live || "0"), 0)}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </form>
      </Form>
      <ModalFiliais
        open={modalFilialOpen}
        handleSelection={handleSelectFilial}
        onOpenChange={setModalFilialOpen}
        closeOnSelection
        isLojaTim
        id_grupo_economico={form.watch("id_grupo_economico")}
      />
      <ModalMetas
        multiSelection
        initialFilters={{
          mes,
          ano,
          cpf_list: metas_agregadas?.split(";"),
          agregacao: form.watch("tipo_agregacao"),
        }}
        handleMultiSelection={handleSelectMetas}
        open={modalMetasOpen}
        closeOnSelection
        // @ts-ignore
        onOpenChange={setModalMetasOpen}
      />
    </div>
  );
};

export default FormAgregador;
