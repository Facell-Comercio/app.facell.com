import FormSwitch from "@/components/custom/FormSwitch";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import AlertPopUp from "@/components/custom/AlertPopUp";
import FormSelectGrupoEconomico from "@/components/custom/FormSelectGrupoEconomico";
import SelectMes from "@/components/custom/SelectMes";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { exportToExcel, importFromExcel } from "@/helpers/importExportXLS";
import { useOrcamento } from "@/hooks/financeiro/useOrcamento";
import { api } from "@/lib/axios";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Download, Eye, Plus, Search, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useWatch } from "react-hook-form";
import { dataFormatada } from "./Modal";
import ModalInsert from "./ModalInsert";
import RowVirtualizerFixed, { itemContaProps } from "./RowVirtualizedFixed";
import { cadastroSchemaProps, useFormCadastroData } from "./form-data";
import { useStoreCadastro } from "./store";

export type newContaProps = {
  centro_custo: string;
  id_centro_custo: string;
  plano_contas: string;
  id_plano_contas: string;
  grupo_economico?: string;
  valor: string;
};

const FormCadastro = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: cadastroSchemaProps;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  console.log("RENDER - Cadastro:", id);
  const { mutate: insertOne } = useOrcamento().insertOne();
  const { mutate: update } = useOrcamento().update();
  const { mutate: deleteItemBudget } = useOrcamento().deleteItemBudget();

  const [
    openLogsModal,
    closeModal,
    editModal,
    modalEditing,
    openInsertModal,
    closeInsertModal,
    modalInsertOpen,
  ] = useStoreCadastro((state) => [
    state.openLogsModal,
    state.closeModal,
    state.editModal,
    state.modalEditing,
    state.openInsertModal,
    state.closeInsertModal,
    state.modalInsertOpen,
  ]);
  const { form, contas, appendConta, removeConta } = useFormCadastroData(data);
  const [filter, setFilter] = useState("");

  const [refDate, setRefDate] = useState({
    mes: (new Date().getMonth() + 1).toString(),
    ano: new Date().getFullYear().toString(),
  });
  const ref = data.ref;
  const partesData = ref?.split("-") || dataFormatada.split("-");

  const mes = partesData[1];
  const ano = partesData[0];

  const searchRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const id_grupo_economico = useWatch({
    name: "id_grupo_economico",
    control: form.control,
  });

  useEffect(() => {
    form.resetField("contas");
  }, [id_grupo_economico]);

  function onSubmitData(data: cadastroSchemaProps) {
    const filteredData: cadastroSchemaProps = {
      id: data.id,
      active: !!+form.watch("active"),
      id_grupo_economico: data.id_grupo_economico,
      ref: `${refDate.ano}-${refDate.mes}-1`,
      contas: data.contas?.filter((conta) => {
        const hasId = conta.id_conta;
        const sameValue = conta.valor === conta.valor_inicial;
        if (!hasId || !sameValue) return conta;
      }),
    };

    if (id) {
      update(filteredData);
    } else {
      insertOne(filteredData);
    }

    editModal(false);
    closeModal();
  }

  function filteredContas() {
    const newArray: itemContaProps[] = [];
    contas.forEach((item: itemContaProps) =>
      newArray.push({
        id: item.id,
        centro_custo: item.centro_custo,
        plano_contas: item.plano_contas,
        id_conta: item.id_conta,
        saldo: item.saldo,
        realizado: item.realizado,
        valor_inicial: item.valor_inicial,
      })
    );
    return newArray.filter((conta) => {
      if (filter) {
        return (
          conta.centro_custo?.includes(filter.toUpperCase()) ||
          conta.plano_contas?.includes(filter.toUpperCase())
        );
      } else {
        return conta;
      }
    });
  }

  function exportedFilteredData(data: any[], grupo_economico: string) {
    const newArray: any[] = [];
    data.forEach((item) =>
      newArray.push({
        grupo_economico: grupo_economico,
        centro_custo: item.centro_custo,
        plano_contas: item.plano_contas,
        valor: parseFloat(item.valor.toString()),
      })
    );
    exportToExcel(newArray, "cadastro");
  }

  function addNewConta(newConta: newContaProps, isImported?: boolean) {
    try {
      const hasIds = newConta.id_centro_custo && newConta.id_plano_contas;
      const isDuplicated =
        contas.findIndex((conta) => {
          const hasCentroCustos =
            conta.id_centro_custo === newConta.id_centro_custo;
          const hasPlanoContas =
            conta.id_plano_contas === newConta.id_plano_contas;

          return hasCentroCustos && hasPlanoContas;
        }) !== -1;

      if (isDuplicated) {
        throw new Error("Item já existente");
      }
      if (!hasIds) {
        throw new Error("Selecione o centro de custo e o plano de contas");
      }
      appendConta({
        centro_custo: newConta.centro_custo,
        plano_contas: newConta.plano_contas,
        id_centro_custo: newConta.id_centro_custo,
        id_plano_contas: newConta.id_plano_contas,
        valor: newConta.valor.toString(),
      });

      closeInsertModal();
    } catch (e: any) {
      if (!isImported) {
        toast({
          title: "Erro ao realizar a inclusão",
          description: e.message,
        });
      }
    }
  }
  function removeItemConta(index: number, id?: string) {
    if (id) deleteItemBudget(id);
    removeConta(index);
  }

  const handleChangeImportButton = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async (e) => {
        const importedData = e.target?.result;
        const result = importFromExcel(importedData)[0] as newContaProps;
        const responseError: any[] = [];
        // console.log(importFromExcel(importedData));

        const { centro_custo, plano_contas, valor } = result;
        if (!id_grupo_economico) {
          toast({
            title: "Sem grupo econômico",
            description:
              "Nenhum grupo econômico foi selecionado, antes de realizar a importação defina o grupo econômico",
          });
        } else if (centro_custo && plano_contas && valor) {
          try {
            const response = await api.post("/financeiro/orcamento/get-ids", {
              data: importFromExcel(importedData),
              id_grupo_economico: id_grupo_economico,
            });
            const { returnedIds, erros } = response.data;

            importFromExcel(importedData).forEach(
              // @ts-expect-error "Vai funcionar"
              (item: newContaProps, index: number) => {
                responseError.push({
                  centro_custo: item.centro_custo,
                  plano_contas: item.plano_contas,
                  id_centro_custo: returnedIds[index].id_centro_custo,
                  id_plano_contas: returnedIds[index].id_plano_contas,
                  valor: item.valor.toString(),

                  estado_centro_custo: erros[index].centro_custo,
                  estado_plano_contas: erros[index].plano_contas,
                });
                addNewConta(
                  {
                    centro_custo: item.centro_custo,
                    plano_contas: item.plano_contas,
                    id_centro_custo: returnedIds[index].id_centro_custo,
                    id_plano_contas: returnedIds[index].id_plano_contas,
                    valor: item.valor.toString(),
                  },
                  true
                );
              }
            );
          } catch (err) {
            console.log("ERRO NA IMPORTAÇÃO ", err);
          } finally {
            toast({
              title: "Importação realizada",
              description:
                "As contas de mesmo grupo econômico foram importadas com sucesso",
              duration: 5000,
              action: (
                <ToastAction
                  altText="Ver status"
                  onClick={() =>
                    exportToExcel(
                      responseError,
                      `status-cadastro-${refDate.mes}-${refDate.ano}`
                    )
                  }
                >
                  Ver status
                </ToastAction>
              ),
            });
          }
        } else {
          toast({
            title: "Arquivo incompleto",
            description:
              "O aquivo não pode ser importado, pois não tem todos os dados necessários",
          });
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
    }
  };

  // console.log(form.formState.errors);

  return (
    <div className="flex flex-col gap-4 max-w-full max-h-[90vh] overflow-hidden p-2">
      <Form {...form}>
        <div className="flex justify-between text-lg font-medium">
          <span>
            {data.grupo_economico
              ? `Orçamento: ${mes}/${ano} - ${data.grupo_economico}`
              : "Novo Orçamento"}
          </span>
          <FormSwitch
            name="active"
            label="Ativo"
            control={form.control}
            disabled={!modalEditing}
          />
        </div>
        <div className="flex justify-between">
          <div className="flex gap-2">
            {!!data.id_grupo_economico && (
              <Button
                size={"sm"}
                className="text-sm"
                variant={"outline"}
                type={"button"}
                onClick={() =>
                  exportedFilteredData(contas, data.grupo_economico || "")
                }
              >
                <Download className="me-2" size={18} />
                Exportar
              </Button>
            )}
            {modalEditing && (
              <AlertPopUp
                title="Deseja realmente importar?"
                description="Esta ação não pode ser desfeita. Ao adicionar muitos itens a este orçamento, pode ser necessário apagá-los individualmente, o que pode se tornar cansativo. Por favor, confirme se deseja prosseguir."
                action={() =>
                  fileInputRef.current && fileInputRef.current.click()
                }
              >
                <Button size={"sm"} className="text-sm" variant={"outline"}>
                  <Upload className="me-2" size={18} />
                  Importar
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleChangeImportButton}
                    accept=".xlsx, .xls, .csv"
                  />
                </Button>
              </AlertPopUp>
            )}
            <Button
              size={"sm"}
              className="text-sm"
              variant={"outline"}
              onClick={() => openLogsModal(id || "")}
            >
              <Eye className="me-2" size={18} />
              Visualizar Alterações
            </Button>
          </div>
          {id_grupo_economico && modalEditing && (
            <Button
              size={"sm"}
              className="text-xs"
              type="button"
              onClick={() => {
                console.log(modalInsertOpen);

                openInsertModal();
              }}
            >
              <Plus className="me-2" strokeWidth={2} size={18} />
              Nova conta
            </Button>
          )}
        </div>

        {/* Seleção de grupo, mes e ano */}
        {!id && (
          <div className="flex gap-2">
            <FormSelectGrupoEconomico
              className="flex-1 min-w-32"
              name={"id_grupo_economico"}
              label={"Grupo Econômico"}
              control={form.control}
            />
            <div>
              <label className="text-sm font-medium">Mês</label>
              <SelectMes
                value={refDate.mes}
                className="mt-2"
                onValueChange={(e) => {
                  setRefDate({ ...refDate, mes: e });
                }}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Ano</label>
              <Input
                type="number"
                min={2020}
                max={new Date().getFullYear() + 1}
                step={"1"}
                placeholder="Ano"
                className="w-[80px] mt-2"
                value={refDate.ano}
                onChange={(e) => {
                  setRefDate({ ...refDate, ano: e.target.value });
                }}
              />
            </div>
          </div>
        )}

        {/* Pesquisar conta */}
        <div className={`${!contas.length ? "hidden" : "flex"} gap-3`}>
          <Input
            ref={searchRef}
            type="search"
            className="h-9 text-sm"
            placeholder="Pesquisar..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setFilter(searchRef.current?.value || "");
              }
            }}
          />
          <Button
            size={"sm"}
            className="text-xs"
            variant={"tertiary"}
            onClick={() => setFilter(searchRef.current?.value || "")}
          >
            <Search className="me-2" size={18} />
            Pesquisar conta
          </Button>
        </div>

        <ScrollArea>
          <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
            <div
              className={`w-full flex flex-col gap-1 ${
                !contas.length && "hidden"
              }`}
            >
              {/* Inserção de nova conta */}
              <header
                className={`flex gap-1 w-full mx-auto font-medium text-sm`}
              >
                <span className={`flex-1 `}>Centro de Custos</span>
                <span className={`flex-1 w-5/12 `}>Plano de Contas</span>
                <span className={`flex-1 `}>Valor</span>
                {modalEditing && <span className="w-16"></span>}
              </header>

              <RowVirtualizerFixed
                id={id || ""}
                data={filteredContas()}
                form={form}
                modalEditing={modalEditing}
                removeItem={removeItemConta}
              />
            </div>
          </form>
        </ScrollArea>
      </Form>
      <ModalInsert
        addNewConta={addNewConta}
        id_grupo_economico={id_grupo_economico}
      />
    </div>
  );
};

export default FormCadastro;
