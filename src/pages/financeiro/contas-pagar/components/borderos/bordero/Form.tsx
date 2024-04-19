import FormDateInput from "@/components/custom/FormDate";
import { Input } from "@/components/custom/FormInput";
import SelectContaBancaria from "@/components/custom/SelectContaBancaria";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { useBordero } from "@/hooks/useBordero";
import { api } from "@/lib/axios";
import ModalTitulos, {
  TitulosProps,
} from "@/pages/financeiro/components/ModalTitulos";
import { Fingerprint, List, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { BorderoSchemaProps } from "./Modal";
import RowVirtualizerFixed from "./RowVirtualizedFixed";
import { useFormBorderoData } from "./form-data";
import { useStoreBordero } from "./store";

const FormBordero = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: BorderoSchemaProps;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  console.log("RENDER - Borderos:", id);
  const { mutate: insertOne } = useBordero().insertOne();
  const { mutate: update } = useBordero().update();
  const { mutate: deleteTitulo } = useBordero().deleteTitulo();

  const modalEditing = useStoreBordero().modalEditing;
  const editModal = useStoreBordero().editModal;
  const closeModal = useStoreBordero().closeModal;
  const setCheckedTitulos = useStoreBordero().setCheckedTitulos;
  const getTitulo = useStoreBordero().getTitulo;

  const [modalTituloOpen, setModalTituloOpen] = useState<boolean>(false);
  const { form, titulos, addTitulo, removeTitulo } = useFormBorderoData(data);

  const id_conta_bancaria = form.watch("id_conta_bancaria");
  const id_matriz = form.watch("id_matriz");

  const titulosChecked = form.watch("titulos");
  useEffect(() => {
    setCheckedTitulos(
      titulosChecked
        .filter((titulo) => titulo.checked)
        .map((titulo) => titulo.id_titulo)
    );
  }, [getTitulo]);

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

    if (!id) insertOne(data);
    if (id) update(filteredData);

    editModal(false);
    closeModal();
  }

  function handleSelectionTitulo(item: TitulosProps[]) {
    item.forEach((subItem: TitulosProps) => addTitulo(subItem));
    setModalTituloOpen(false);
  }
  async function handleChangeContaBancaria(novo_id_conta: string) {
    const response = await api.get(
      `financeiro/contas-bancarias/${novo_id_conta}`
    );

    console.log(response.data);
    form.setValue("banco", response.data.banco);

    if (!data.id_matriz && !id_matriz) {
      form.setValue("id_matriz", response.data.id_matriz);
    }
  }

  function removeItemTitulos(index: number, id?: string) {
    if (id) deleteTitulo(id);
    removeTitulo(index);
  }

  // const data_pagamento = form.watch("data_pagamento");
  // console.log(data_pagamento);
  console.log(form.formState.errors);

  return (
    <div className="max-w-full max-h-[90vh] overflow-hidden">
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
          <div className="max-w-full flex flex-col lg:flex-row gap-5">
            {/* Primeira coluna */}
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex justify-between mb-3">
                  <div className="flex gap-2">
                    <Fingerprint />{" "}
                    <span className="text-lg font-bold ">Dados do Borderô</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <SelectContaBancaria
                    disabled={!modalEditing}
                    name="id_conta_bancaria"
                    control={form.control}
                    label="Conta Bancaria"
                    id_matriz={form.watch("id_matriz") || ""}
                    onChange={(e) => handleChangeContaBancaria(e || "")}
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

              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center gap-2 mb-3 justify-between">
                  <span className="flex gap-2 items-center">
                    <List /> <span className="text-lg font-bold ">Títulos</span>
                  </span>
                  {id_conta_bancaria && modalEditing && (
                    <Button
                      type="button"
                      onClick={() => setModalTituloOpen(true)}
                    >
                      <Plus className="me-2" strokeWidth={2} />
                      Novo Título
                    </Button>
                  )}
                  <ModalTitulos
                    open={modalEditing && modalTituloOpen}
                    handleSelecion={handleSelectionTitulo}
                    onOpenChange={() => setModalTituloOpen((prev) => !prev)}
                    id_matriz={id_matriz || ""}
                  />
                </div>
                {id_conta_bancaria && (
                  <>
                    {form.watch("titulos").length > 0 && (
                      <header className="flex py-1 pl-1 pr-2 gap-1 font-medium text-sm">
                        <Checkbox
                          className="flex-1 max-w-[16px] me-1"
                          onCheckedChange={(e) => {
                            titulos.forEach((item, index) => {
                              form.setValue(
                                `titulos.${index}.checked`,
                                !!e.valueOf()
                              );
                            });
                          }}
                        />
                        <p className="w-16 text-center">ID</p>
                        <p className="pl-1 w-24">Vencimento</p>
                        <p className="flex-1 pl-1">Fornecedor</p>
                        <p className="w-24 text-center">Nº Doc</p>
                        <p className="pl-1 w-24">Valor</p>
                        <p className="flex-1 pl-1">Filial</p>
                        {modalEditing && (
                          <p className="flex-1 pl-1 max-w-[52px]">Ação</p>
                        )}
                        {/* <p className="flex-1"></p> */}
                      </header>
                    )}
                    <div className="flex gap-3 flex-wrap">
                      <RowVirtualizerFixed
                        data={titulos}
                        form={form}
                        modalEditing={modalEditing}
                        removeItem={removeItemTitulos}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormBordero;
