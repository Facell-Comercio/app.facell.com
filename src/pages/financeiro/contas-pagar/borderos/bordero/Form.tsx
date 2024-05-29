import AlertPopUp from "@/components/custom/AlertPopUp";
import FormDateInput from "@/components/custom/FormDate";
import { Input } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { exportToExcel } from "@/helpers/importExportXLS";
import { useBordero } from "@/hooks/financeiro/useBordero";
import { api } from "@/lib/axios";
import ModalContasBancarias, {
  ItemContaBancariaProps,
} from "@/pages/financeiro/components/ModalContasBancarias";

import {
  ArrowUpDown,
  Download,
  Fingerprint,
  List,
  Minus,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { useFormBorderoData } from "./form-data";
import { useStoreBordero } from "./store";

// Componentes
import { Badge } from "@/components/ui/badge";
import { normalizeCurrency } from "@/helpers/mask";
import ModalVencimentos, {
  VencimentosProps,
} from "@/pages/financeiro/components/ModalVencimentos";
import { BorderoSchemaProps } from "./Modal";
import ModalTransfer from "./ModalTransfer";
import RowVirtualizerFixed from "./RowVirtualizedFixed";

const FormBordero = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: BorderoSchemaProps;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  // console.log("RENDER - Borderos:", id);
  const { mutate: insertOne } = useBordero().insertOne();
  const { mutate: update } = useBordero().update();
  const { mutate: deleteVencimento } = useBordero().deleteVencimento();

  const modalEditing = useStoreBordero().modalEditing;
  const editModal = useStoreBordero().editModal;
  const closeModal = useStoreBordero().closeModal;
  const toggleModalTransfer = useStoreBordero().toggleModalTransfer;

  const [modalVencimentoOpen, setModalVencimentoOpen] =
    useState<boolean>(false);
  const [modalContaBancariaOpen, setModalContaBancariaOpen] =
    useState<boolean>(false);

  const [exporting, setExporting] = useState<string>("");

  const { form, vencimentos, addVencimento, removeVencimento } =
    useFormBorderoData(data);

  const id_conta_bancaria = form.watch("id_conta_bancaria");
  const id_matriz = form.watch("id_matriz");
  const data_pagamento = form.watch("data_pagamento");
  const wVencimentos = form.watch("vencimentos");

  const vencimentosChecked: VencimentosProps[] = form
    .watch("vencimentos")
    .filter((v) => v.checked);

  function onSubmitData(newData: BorderoSchemaProps) {
    const filteredData: BorderoSchemaProps = {
      id: newData.id,
      id_conta_bancaria: newData.id_conta_bancaria,
      data_pagamento: newData.data_pagamento,
      id_matriz: newData.id_matriz,
      vencimentos: newData.vencimentos?.filter(
        (vencimento: VencimentosProps) =>
          !data.vencimentos.find(
            (obj) => obj.id_vencimento == vencimento.id_vencimento
          )
      ),
    };
    if (!id) insertOne(newData);
    console.log(filteredData);

    if (id) update(filteredData);

    editModal(false);
    closeModal();
  }

  function handleSelectionVencimento(item: VencimentosProps[]) {
    item.forEach((subItem: VencimentosProps) => addVencimento(subItem));
    setModalVencimentoOpen(false);
  }

  function handleSelectionContaBancaria(item: ItemContaBancariaProps) {
    form.setValue("id_conta_bancaria", item.id);
    form.setValue("conta_bancaria", item.descricao);
    form.setValue("banco", item.banco);
    if (!data.id_matriz && !id_matriz) {
      form.setValue("id_matriz", item.id_matriz);
    }

    setModalContaBancariaOpen(false);
  }

  async function removeItemVencimentos(
    index: number,
    id?: string,
    id_status?: string
  ) {
    if (id_status != "4") {
      deleteVencimento(id);
      removeVencimento(index);
    } else {
      toast({
        title: "Erro",
        description:
          "Não é possível remover do borderô vencimentos de títulos com status pago!",
        duration: 3500,
      });
    }
  }

  async function removeCheckedVencimentos(
    checkedVencimentos: VencimentosProps[]
  ) {
    const novosVencimentos = wVencimentos.filter(
      (v: VencimentosProps) =>
        !checkedVencimentos
          .map((v) => v.id_vencimento)
          .includes(v.id_vencimento)
    );
    form.setValue("vencimentos", novosVencimentos);
  }

  async function exportBordero(id: string) {
    setExporting("default");
    const response = await api.put(
      `/financeiro/contas-a-pagar/bordero/export`,
      { data: [id] }
    );
    exportToExcel(response.data, `bordero-${id}`);
    setExporting("");
  }

  async function exportRemessa(id: string) {
    setExporting("remessa");
    setTimeout(() => {
      setExporting("");
    }, 4000);

    return;
    const response = await api.put(
      `/financeiro/contas-a-pagar/bordero/export-remessa`,
      { data: [id] }
    );
    exportToExcel(response.data, `bordero-${id}`);
  }

  // const data_pagamento = form.watch("data_pagamento");
  // console.log(form.formState.errors);
  // console.log(form.watch("vencimentos"), data.vencimentos);

  return (
    <div className="max-w-full max-h-[90vh] overflow-hidden">
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmitData)}
          className="grid grid-cols-1 lg:flex-row gap-5"
        >
          {/* Primeira coluna */}
          <div className="max-w-full grid grid-cols-1 gap-3 shrink-0">
            {/* Dados do Borderô */}
            <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
              <div className="flex justify-between mb-3">
                <div className="flex gap-2">
                  <Fingerprint />{" "}
                  <span className="text-lg font-bold ">Dados do Borderô</span>
                </div>

                {/* Exportação */}
                {id && (
                  <div className="flex gap-3 items-center">
                    <Button
                      disabled={!!exporting}
                      variant={"outline"}
                      type={"button"}
                      onClick={() => exportRemessa(id)}
                    >
                      {exporting == "remessa" ? (
                        <FaSpinner size={18} className="me-2 animate-spin" />
                      ) : (
                        <Download className="me-2" size={20} />
                      )}{" "}
                      Exportar Remessa
                    </Button>
                    <Button
                      disabled={!!exporting}
                      variant={"outline"}
                      type={"button"}
                      onClick={() => exportBordero(id || "")}
                    >
                      {exporting == "default" ? (
                        <FaSpinner size={18} className="me-2 animate-spin" />
                      ) : (
                        <Download className="me-2" size={20} />
                      )}
                      Exportar
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col justify-end flex-1">
                  <label className="text-sm font-medium">Conta Bancária</label>
                  <Input
                    value={form.watch("conta_bancaria")?.toUpperCase()}
                    className="flex-1 max-h-10 mt-2"
                    readOnly
                    disabled={!modalEditing}
                    onClick={() => setModalContaBancariaOpen(true)}
                    placeholder="Selecione a conta bancária"
                  />
                </div>
                <ModalContasBancarias
                  open={modalEditing && modalContaBancariaOpen}
                  handleSelection={handleSelectionContaBancaria}
                  onOpenChange={() =>
                    setModalContaBancariaOpen((prev) => !prev)
                  }
                  id_matriz={id_matriz || ""}
                />
                <div className="flex flex-col justify-end flex-1">
                  <label className="text-sm font-medium">Banco</label>
                  <Input
                    value={form.watch("banco")?.toUpperCase()}
                    className="flex-1 max-h-10 mt-2"
                    readOnly
                    disabled={!modalEditing}
                    placeholder="Defina a conta bancária"
                  />
                </div>
                <FormDateInput
                  disabled={!modalEditing}
                  name="data_pagamento"
                  label="Data de Pagamento"
                  control={form.control}
                />
              </div>
            </div>

            {/* Titúlos do Borderô */}
            <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center gap-2 mb-3 justify-between">
                <span className="flex gap-2 items-center">
                  <List />{" "}
                  <span className="text-lg font-bold ">
                    Vencimentos a Pagar
                  </span>
                </span>
                <div className="flex gap-2">
                  {id_conta_bancaria &&
                    modalEditing &&
                    vencimentosChecked.length > 0 && (
                      <>
                        <Button
                          type={"button"}
                          variant={"tertiary"}
                          className="text-white justify-self-start"
                          onClick={() => toggleModalTransfer()}
                        >
                          <ArrowUpDown className="me-2" />
                          Transferir de borderô
                        </Button>
                        <AlertPopUp
                          title="Deseja realmente remover esses vencimentos?"
                          description="Os vencimentos serão removidos definitivamente deste borderô, podendo ser incluidos novamente."
                          action={() =>
                            removeCheckedVencimentos(vencimentosChecked)
                          }
                        >
                          <Button
                            type={"button"}
                            variant={"destructive"}
                            className="justify-self-start"
                          >
                            <Minus className="me-2" />
                            Remover
                          </Button>
                        </AlertPopUp>
                      </>
                    )}
                  {id_conta_bancaria && modalEditing && (
                    <Button
                      type="button"
                      onClick={() => setModalVencimentoOpen(true)}
                    >
                      <Plus className="me-2" strokeWidth={2} />
                      Adicionar
                    </Button>
                  )}
                  {/* <ModalVencimentos
                    open={modalEditing && modalVencimentoOpen}
                    handleSelection={handleSelectionVencimento}
                    onOpenChange={() => setModalVencimentoOpen((prev) => !prev)}
                    id_matriz={id_matriz || ""}
                    initialFilters={{
                      tipo_data: "data_prevista",
                      range_data: {
                        from: data_pagamento,
                        to: data_pagamento,
                      },
                    }}
                  /> */}
                  <ModalVencimentos
                    open={modalEditing && modalVencimentoOpen}
                    handleSelection={handleSelectionVencimento}
                    onOpenChange={() => setModalVencimentoOpen((prev) => !prev)}
                    id_matriz={id_matriz || ""}
                    initialFilters={{
                      tipo_data: "data_prevista",
                      range_data: {
                        from: data_pagamento,
                        to: data_pagamento,
                      },
                    }}
                  />
                </div>
              </div>
              {id_conta_bancaria && (
                <>
                  <div className="flex gap-3 flex-wrap overflow-auto scroll-thin">
                    {vencimentos?.length > 0 && (
                      <RowVirtualizerFixed
                        data={wVencimentos}
                        form={form}
                        modalEditing={modalEditing}
                        removeItem={removeItemVencimentos}
                      />
                    )}
                  </div>
                  <div className="ms-2 mt-3 flex gap-2 items-center justify-between">
                    <Badge variant={"info"}>
                      <p className="me-1">Qtde: </p>
                      {vencimentos.length}
                    </Badge>
                    <Badge variant={"info"}>
                      <p className="me-1">Valor Total: </p>
                      {normalizeCurrency(
                        vencimentos.reduce(
                          (acc, item: VencimentosProps) =>
                            acc + +item.valor_total,
                          0
                        ) || 0
                      )}
                    </Badge>
                  </div>
                </>
              )}
            </div>
          </div>
        </form>
        <ModalTransfer data={vencimentosChecked} id_matriz={id_matriz || ""} />
      </Form>
    </div>
  );
};

export default FormBordero;
