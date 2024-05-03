import AlertPopUp from "@/components/custom/AlertPopUp";
import FormDateInput from "@/components/custom/FormDate";
import { Input } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { exportToExcel } from "@/helpers/importExportXLS";
import { normalizeCurrency } from "@/helpers/mask";
import { useBordero } from "@/hooks/useBordero";
import { api } from "@/lib/axios";
import ModalContasBancarias, {
  ItemContaBancariaProps,
} from "@/pages/financeiro/components/ModalContasBancarias";
import ModalTitulos, {
  TitulosProps,
} from "@/pages/financeiro/components/ModalTitulos";
import {
  ArrowUpDown,
  Download,
  Fingerprint,
  List,
  Minus,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFormBorderoData } from "./form-data";
import { useStoreBordero } from "./store";
import { FaSpinner } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";

// Componentes
import { BorderoSchemaProps } from "./Modal";
import RowVirtualizerFixed from "./RowVirtualizedFixed";
import ModalTransfer from "./ModalTransfer";

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
  const { mutate: deleteTitulo } = useBordero().deleteTitulo();
  // const { mutate: transferTitulos } = useBordero().transferTitulos();

  const modalEditing = useStoreBordero().modalEditing;
  const editModal = useStoreBordero().editModal;
  const closeModal = useStoreBordero().closeModal;
  const toggleModalTransfer = useStoreBordero().toggleModalTransfer;

  const [modalTituloOpen, setModalTituloOpen] = useState<boolean>(false);
  const [modalContaBancariaOpen, setModalContaBancariaOpen] =
    useState<boolean>(false);

  const [exporting, setExporting] = useState<string>('');

  const { form, titulos, addTitulo, removeTitulo } = useFormBorderoData(data);

  const id_conta_bancaria = form.watch("id_conta_bancaria");
  const id_matriz = form.watch("id_matriz");
  const data_pagamento = form.watch('data_pagamento');

  const titulosChecked = form
    .watch("titulos")
    .filter((titulo) => titulo.checked);

  function onSubmitData(newData: BorderoSchemaProps) {
    const filteredData: BorderoSchemaProps = {
      id: newData.id,
      id_conta_bancaria: newData.id_conta_bancaria,
      data_pagamento: newData.data_pagamento,
      id_matriz: newData.id_matriz,
      titulos: newData.titulos?.filter(
        (titulo: TitulosProps) =>
          !data.titulos.find((obj) => obj.id_titulo == titulo.id_titulo)
      ),
    };

    console.log(filteredData);

    if (!id) insertOne(newData);
    if (id) update(filteredData);

    editModal(false);
    closeModal();
  }

  function handleSelectionTitulo(item: TitulosProps[]) {
    item.forEach((subItem: TitulosProps) => addTitulo(subItem));
    setModalTituloOpen(false);
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

  async function removeItemTitulos(
    index?: number,
    id?: string,
    id_status?: string
  ) {
    if (id_status != "4") {
      deleteTitulo(id);
      removeTitulo(index && titulos.findIndex((item) => item.id_titulo == id));
    } else {
      toast({
        title: "Erro",
        description:
          "Não é possível remover do borderô titulos com status pago!",
        duration: 3500,
      });
    }
  }

  function removeCheckedTitulos(checkedTitulos: TitulosProps[]) {
    checkedTitulos.forEach((titulo_checked: TitulosProps) => {

      removeItemTitulos(
        undefined,
        titulo_checked.id_titulo,
        titulo_checked.id_status
      );
    });
  }

  async function exportBordero(id: string) {
    setExporting('default')
    const response = await api.put(
      `/financeiro/contas-a-pagar/bordero/export`,
      { data: [id] }
    );
    exportToExcel(response.data, `bordero-${id}`);
    setExporting('')
  }

  async function exportRemessa(id: string) {
    setExporting('remessa')
    setTimeout(() => {
      setExporting('')
    }, 4000)

    return
    const response = await api.put(
      `/financeiro/contas-a-pagar/bordero/export-remessa`,
      { data: [id] }
    );
    exportToExcel(response.data, `bordero-${id}`);
  }

  // const data_pagamento = form.watch("data_pagamento");
  // console.log(data_pagamento);
  // console.log(form.formState.errors);

  return (
    <div className="max-w-full max-h-[90vh] overflow-hidden">
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
          <div className="max-w-full flex flex-col lg:flex-row gap-5">
            {/* Primeira coluna */}
            <div className="flex flex-1 flex-col gap-3 shrink-0">

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
                        {exporting == 'remessa' ? <FaSpinner size={18} className="me-2 animate-spin" /> : <Download className="me-2" size={20} />} Exportar Remessa
                      </Button>
                      <Button
                        disabled={!!exporting}
                        variant={"outline"}
                        type={"button"}
                        onClick={() => exportBordero(id || "")}
                      >
                        {exporting == 'default' ? <FaSpinner size={18} className="me-2 animate-spin" /> : <Download className="me-2" size={20} />}
                        Exportar
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="flex flex-col justify-end flex-1">
                    <label className="text-sm font-medium">
                      Conta Bancária
                    </label>
                    <Input
                      value={form.watch("conta_bancaria")?.toUpperCase()}
                      className="flex-1 max-h-10 mt-2"
                      readOnly
                      disabled={!modalEditing}
                      onClick={() => setModalContaBancariaOpen(true)}
                    />
                  </div>
                  <ModalContasBancarias
                    open={modalEditing && modalContaBancariaOpen}
                    handleSelecion={handleSelectionContaBancaria}
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
                    <List /> <span className="text-lg font-bold ">Títulos</span>

                    
                  </span>
                  <div className="flex gap-2">
                    {id_conta_bancaria &&
                      modalEditing &&
                      titulosChecked.length > 0 && (
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
                            title="Deseja realmente remover esses títulos?"
                            description="Os títulos serão removidos definitivamente deste borderô, podendo ser incluidos novamente."
                            action={() => removeCheckedTitulos(titulosChecked)}
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
                        onClick={() => setModalTituloOpen(true)}
                      >
                        <Plus className="me-2" strokeWidth={2} />
                        Adicionar
                      </Button>
                    )}
                    <ModalTitulos
                      open={modalEditing && modalTituloOpen}
                      handleSelecion={handleSelectionTitulo}
                      onOpenChange={() => setModalTituloOpen((prev) => !prev)}
                      id_matriz={id_matriz || ""}
                      initialFilters={{
                        tipo_data: 'data_prevista', 
                        range_data: {
                          from: data_pagamento, to: data_pagamento
                        }
                      }}
                    />
                  </div>
                </div>
                {id_conta_bancaria && (
                  <>
                    {form.watch("titulos").length > 0 && (
                      <header className="flex py-1 pl-1 pr-5 gap-1 font-medium text-sm">
                        {modalEditing && 
                        <Checkbox
                        className="flex-1 max-w-[16px] me-1"
                        onCheckedChange={(e) => {
                            titulos.forEach((_, index) => {
                              // if (item.id_status == "3") {
                              form.setValue(
                                `titulos.${index}.checked`,
                                !!e.valueOf()
                              );
                              // }
                            });
                          }}
                          />
                        }
                        <p className="w-16 text-center">ID</p>
                        <p className="pl-1 w-24 text-center">Status</p>
                        <p className="pl-1 w-24 text-center">Pagamento</p>
                        <p className="flex-1 pl-1">Fornecedor</p>
                        <p className="w-24 text-center">Nº Doc</p>
                        <p className="pl-1 w-32 text-center">Valor</p>
                        <p className="flex-1 pl-1">Filial</p>
                        {modalEditing && (
                          <p className="flex-1 pl-1 max-w-[52px]">Ação</p>
                        )}
                        {/* <p className="flex-1"></p> */}
                      </header>
                    )}
                    <div className="flex gap-3 flex-wrap">
                      {titulos?.length > 0 && (
                        <RowVirtualizerFixed
                          data={titulos}
                          form={form}
                          modalEditing={modalEditing}
                          removeItem={removeItemTitulos}
                        />
                      )}
                    </div>
                    <div className="ms-2 mt-3 flex gap-2 items-center">
                      <Badge variant={'dark'} className="font-medium text-base">
                        <p className="me-1">Qtde: </p>
                        {titulos.length}
                      </Badge>
                      <Badge variant={'dark'} className="font-medium text-base">
                        <p className="me-1">Valor Total: </p>
                        {normalizeCurrency(
                          titulos.reduce(
                            (acc, item: TitulosProps) =>
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
          </div>
        </form>
        <ModalTransfer data={titulosChecked} id_matriz={id_matriz || ""} />
      </Form>
    </div>
  );
};

export default FormBordero;
