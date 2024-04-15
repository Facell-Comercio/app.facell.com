import FormSwitch from "@/components/custom/FormSwitch";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import AlertPopUp from "@/components/custom/AlertPopUp";
import SelectGrupoEconomico from "@/components/custom/SelectGrupoEconomico";
import SelectMes from "@/components/custom/SelectMes";
import { toast } from "@/components/ui/use-toast";
import { exportToExcel, importFromExcel } from "@/helpers/importExportXLS";
import { useOrcamento } from "@/hooks/useOrcamento";
import { api } from "@/lib/axios";
import ModalCentrosCustos from "@/pages/admin/components/ModalCentrosCustos";
import ModalPlanoContas, {
  ItemPlanoContas,
} from "@/pages/financeiro/components/ModalPlanoContas";
import { CentroCustos } from "@/types/financeiro/centro-custos-type";
import { ChevronDown, Download, Plus, Search, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useWatch } from "react-hook-form";
import { dataFormatada } from "./Modal";
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
  const { mutate: deleteBudget } = useOrcamento().deleteBudget();

  const closeModal = useStoreCadastro().closeModal;
  const { form, contas, appendConta, removeConta } = useFormCadastroData(data);
  const modalEditing = useStoreCadastro().modalEditing;
  const [modalPlanoContasOpen, setModalPlanoContasOpen] = useState(false);
  const [modalCentrosCustoOpen, setModalCentrosCustoOpen] = useState(false);
  const [insertContaIsOpen, setInsertContaIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [newConta, setNewConta] = useState({
    centro_custo: "",
    plano_contas: "",
    id_centro_custo: "",
    id_plano_contas: "",
    valor: "",
  });
  const [refDate, setRefDate] = useState({
    mes: (new Date().getMonth() + 1).toString(),
    ano: new Date().getFullYear().toString(),
  });

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

  function addNewConta(newConta: newContaProps) {
    const hasIds = newConta.id_centro_custo && newConta.id_plano_contas;
    const isDuplicated =
      contas.findIndex((conta) => {
        const hasCentroCustos =
          conta.id_centro_custo === newConta.id_centro_custo;
        const hasPlanoContas =
          conta.id_plano_contas === newConta.id_plano_contas;

        return hasCentroCustos && hasPlanoContas;
      }) !== -1;

    if (!hasIds) {
      toast({
        title: "Atenção",
        description:
          "É necessário selecionar um centro de custos e um plano de contas",
      });
    } else if (isDuplicated) {
      toast({
        title: "Conta duplicada",
        description: "Centro de custos e plano de contas já existentes",
      });
    } else {
      console.log({
        centro_custo: newConta.centro_custo,
        plano_contas: newConta.plano_contas,
        id_centro_custo: newConta.id_centro_custo,
        id_plano_contas: newConta.id_plano_contas,
        valor: newConta.valor.toString(),
      });

      appendConta({
        centro_custo: newConta.centro_custo,
        plano_contas: newConta.plano_contas,
        id_centro_custo: newConta.id_centro_custo,
        id_plano_contas: newConta.id_plano_contas,
        valor: newConta.valor.toString(),
      });

      setInsertContaIsOpen(false);
      setNewConta({
        centro_custo: "",
        plano_contas: "",
        id_centro_custo: "",
        id_plano_contas: "",
        valor: "",
      });
    }
  }
  function removeItemConta(index: number, id?: string) {
    if (id) deleteBudget(id);
    removeConta(index);
  }

  const ref = data.ref;
  const partesData = ref?.split("-") || dataFormatada.split("-");

  const mes = partesData[1];
  const ano = partesData[0];

  function handleSelectionCentroCustos(item: CentroCustos) {
    setNewConta({
      ...newConta,
      centro_custo: item.nome,
      id_centro_custo: item.id,
    });
    setModalCentrosCustoOpen(false);
  }

  function handleSelectionPlanoContas(item: ItemPlanoContas) {
    setNewConta({
      ...newConta,
      plano_contas: item.codigo + " - " + item.descricao,
      id_plano_contas: item.id,
    });
    setModalPlanoContasOpen(false);
  }

  const searchRef = useRef<HTMLInputElement | null>(null);

  const id_grupo_economico = useWatch({
    name: "id_grupo_economico",
    control: form.control,
  });

  console.log(!id_grupo_economico);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
        console.log(importFromExcel(importedData));

        const { centro_custo, plano_contas, valor } = result;

        console.log(id_grupo_economico, data.grupo_economico);

        if (!id_grupo_economico) {
          toast({
            title: "Sem grupo econômico",
            description:
              "Nenhum grupo econômico foi selecionado, antes de realizar a importação defina o grupo econômico",
          });
        } else if (id_grupo_economico !== data.id_grupo_economico) {
          toast({
            title: "Grupo econômico incorreto",
            description:
              "Faça a importação dos orçamentos de um mesmo grupo econômico",
          });
        } else if (centro_custo && plano_contas && valor) {
          try {
            const returnedIds = await api.get("/financeiro/orcamento/get-ids", {
              params: importFromExcel(importedData),
            });
            const newArray: any[] = [];

            importFromExcel(importedData).forEach(
              // @ts-expect-error "Vai funcionar"
              (item: newContaProps, index: number) => {
                addNewConta({
                  centro_custo: item.centro_custo,
                  plano_contas: item.plano_contas,
                  id_centro_custo: returnedIds.data[index].id_centro_custo,
                  id_plano_contas: returnedIds.data[index].id_plano_contas,
                  valor: item.valor.toString(),
                });
              }
            );

            console.log("IDS Retornados:", newArray);
          } catch (err) {
            console.log(err);
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
    <div className="flex flex-col gap-4 max-w-full overflow-x-hidden p-2">
      <Form {...form}>
        <div className="flex justify-between text-lg font-medium">
          <span>
            {data.grupo_economico
              ? `Budget: ${mes}/${ano} - ${data.grupo_economico}`
              : "Novo Budget"}
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
            <Button
              variant={"outline"}
              type={"button"}
              onClick={() =>
                exportedFilteredData(contas, data.grupo_economico || "")
              }
            >
              <Upload className="me-2" size={20} />
              Exportar
            </Button>
            {modalEditing && (
              <AlertPopUp
                title="Deseja realmente importar?"
                description="Esta ação não pode ser desfeita. Ao adicionar muitos itens a este orçamento, pode ser necessário apagá-los individualmente, o que pode se tornar cansativo. Por favor, confirme se deseja prosseguir."
                action={() =>
                  fileInputRef.current && fileInputRef.current.click()
                }
              >
                <Button variant={"outline"}>
                  <Download className="me-2" size={20} />
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
          </div>
          {id_grupo_economico && modalEditing && (
            <Button type="button" onClick={() => setInsertContaIsOpen(true)}>
              <Plus className="me-2" strokeWidth={2} />
              Novo Item
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Input
            ref={searchRef}
            type="search"
            placeholder="Pesquisar..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setFilter(searchRef.current?.value || "");
              }
            }}
          />
          <Button
            className="dark:bg-purple-500"
            onClick={() => setFilter(searchRef.current?.value || "")}
          >
            <Search className="me-2" />
            Procurar
          </Button>
        </div>
        {!id && (
          <div className="flex gap-2 items-end">
            <SelectGrupoEconomico
              className="flex-1 min-w-32"
              value={id_grupo_economico}
              onChange={(id) => {
                form.setValue("id_grupo_economico", id || "");
                data.id_grupo_economico = id || "";
              }}
            />
            <div>
              <label className="text-sm font-medium">Mês</label>
              <SelectMes
                value={refDate.mes}
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
                className="w-[80px]"
                value={refDate.ano}
                onChange={(e) => {
                  setRefDate({ ...refDate, ano: e.target.value });
                }}
              />
            </div>
          </div>
        )}
        <div
          className={`flex gap-3 ${
            !insertContaIsOpen
              ? "opacity-0 transition-all -translate-x-1 duration-500 ease-in-out hidden"
              : "opacity-100"
          }`}
        >
          <span
            className="flex-1"
            onClick={() => setModalCentrosCustoOpen(true)}
          >
            <Input
              placeholder="Centro de Custos"
              defaultValue={newConta.centro_custo && newConta.centro_custo}
            />
          </span>
          <ModalCentrosCustos
            handleSelecion={handleSelectionCentroCustos}
            // @ts-expect-error 'Ignore, vai funcionar..'
            onOpenChange={setModalCentrosCustoOpen}
            open={modalCentrosCustoOpen}
            id_grupo_economico={data.id_grupo_economico}
            closeOnSelection={true}
          />

          <span
            className="flex-1"
            onClick={() => setModalPlanoContasOpen(true)}
          >
            <Input
              placeholder="Plano de contas"
              defaultValue={newConta.plano_contas && newConta.plano_contas}
            />
          </span>
          <ModalPlanoContas
            open={modalPlanoContasOpen}
            id_grupo_economico={data.id_grupo_economico}
            tipo="Despesa"
            onOpenChange={() =>
              setModalPlanoContasOpen((prev: boolean) => !prev)
            }
            handleSelecion={handleSelectionPlanoContas}
          />
          <Input
            className="flex-1"
            type="number"
            placeholder="Valor"
            value={newConta.valor}
            step={"0.01"}
            onChange={(e) =>
              setNewConta({ ...newConta, valor: e.target.value })
            }
          />
          <Button onClick={() => addNewConta(newConta)}>
            {/* <ArrowBigDown className="me-2" /> */}
            <ChevronDown className="me-2" />
            Inserir
          </Button>
        </div>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
          <div className="w-full flex flex-col gap-2">
            <header
              className={`flex gap-2 w-[98%] mx-auto pr-3 font-medium ${
                !contas.length && "hidden"
              }`}
            >
              <span className={`flex-1 ${!modalEditing ? "pr-32" : "pr-6"}`}>
                Centro de Custos
              </span>
              <span className={`w-5/12 ${!modalEditing && "pr-4"}`}>
                Plano de Contas
              </span>
              <span className={`flex-1 ${modalEditing && "pl-3"}`}>Valor</span>
              <span className="w-1/12"></span>
            </header>
            {/* <ScrollArea className="flex flex-col w-[98%] mx-auto max-h-72 pr-3"> */}
            {/* {contas
                  .filter((conta) => {
                    if (filter) {
                      return (
                        conta.centro_custo?.includes(filter.toUpperCase()) ||
                        conta.plano_contas?.includes(filter.toUpperCase())
                      );
                    } else {
                      return conta;
                    }
                  })
                  .map((item, index) => {
                    return (
                      <div className="flex gap-2 py-1 pl-1" key={item.id}>
                        <Input
                          className="flex-1"
                          value={item.centro_custo}
                          readOnly={true}
                        />
                        <Input
                          className="w-5/12"
                          value={item.plano_contas}
                          readOnly={true}
                        />
                        <FormInput
                          type="number"
                          className="flex-1"
                          name={`contas.${index}.valor`}
                          control={form.control}
                          readOnly={!modalEditing}
                        />
                        <AlertPopUp
                          title="Deseja realmente excluir?"
                          description="Essa ação não pode ser desfeita. A conta será excluída definitivamente do servidor, podendo ser enviada novamente."
                          action={() => removeItemConta(index, item.id_conta)}
                        >
                          {modalEditing ? (
                            <Button
                              type="button"
                              className="w-1/12"
                              variant={"destructive"}
                            >
                              <Trash />
                            </Button>
                          ) : (
                            <></>
                          )}
                        </AlertPopUp>
                      </div>
                    );
                  })} */}
            <RowVirtualizerFixed
              data={filteredContas()}
              form={form}
              modalEditing={modalEditing}
              removeItem={removeItemConta}
            />
            {/* </ScrollArea> */}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormCadastro;
