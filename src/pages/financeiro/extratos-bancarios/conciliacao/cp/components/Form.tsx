import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import {
  normalizeCurrency,
  normalizeDate,
  normalizeFirstAndLastName,
} from "@/helpers/mask";
import { useConciliacaoCP } from "@/hooks/financeiro/useConciliacaoCP";
import ModalTitulos, {
  TitulosProps,
} from "@/pages/financeiro/components/ModalTitulos";
import { Fingerprint, List, Plus } from "lucide-react";
import { useState } from "react";

// Componentes
import { Input } from "@/components/ui/input";
import { ConciliacaoCPSchemaProps, TitulosPropsConciliacao } from "./Modal";
import RowVirtualizerFixed from "./RowVirtualizedFixed";
import { useFormConciliacaoCPData } from "./form-data";
import { useStoreConciliacaoCP } from "./store";

const FormConciliacaoCP = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: ConciliacaoCPSchemaProps;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  // console.log("RENDER - ConciliacaoCPs:", id);
  // const { mutate: insertOne } = useConciliacaoCP().insertOne();
  // const { mutate: update } = useConciliacaoCP().update();
  const { mutate: deleteTitulo } = useConciliacaoCP().deleteTitulo();
  // const { mutate: transferTitulos } = useConciliacaoCP().transferTitulos();

  const modalEditing = useStoreConciliacaoCP().modalEditing;
  const editModal = useStoreConciliacaoCP().editModal;
  const closeModal = useStoreConciliacaoCP().closeModal;

  const [modalTituloOpen, setModalTituloOpen] = useState<boolean>(false);
  useState<boolean>(false);

  const { form, titulos, addTitulo, removeTitulo } =
    useFormConciliacaoCPData(data);

  // const titulosChecked = form
  //   .watch("titulos")
  //   .filter((titulo) => titulo.checked);

  function onSubmitData(newData: ConciliacaoCPSchemaProps) {
    const filteredData: ConciliacaoCPSchemaProps = {
      id: newData.id,
      titulos: newData.titulos?.filter(
        (titulo: TitulosPropsConciliacao) =>
          !data.titulos.find((obj) => obj.id_titulo == titulo.id_titulo)
      ),
    };

    console.log(filteredData);

    // update(filteredData);

    editModal(false);
    closeModal();
  }

  function handleSelectionTitulo(item: TitulosProps[]) {
    item.forEach((subItem: TitulosProps) =>
      addTitulo({
        id_titulo: subItem.id_titulo,
        descricao: subItem.descricao,
        nome_fornecedor: subItem.nome_fornecedor,
        num_doc: subItem.num_doc,
        valor: subItem.valor_total,
        filial: subItem.filial,
      })
    );
    setModalTituloOpen(false);
  }

  async function removeItemTitulos(index?: number, id?: string) {
    deleteTitulo(id);
    removeTitulo(index && titulos.findIndex((item) => item.id_titulo == id));
  }

  // function removeCheckedTitulos(checkedTitulos: TitulosProps[]) {
  //   checkedTitulos.forEach((titulo_checked: TitulosProps) => {
  //     removeItemTitulos(
  //       undefined,
  //       titulo_checked.id_titulo,
  //       titulo_checked.id_status
  //     );
  //   });
  // }

  // console.log(form.formState.errors);

  return (
    <div className="max-w-full max-h-[90vh] overflow-hidden">
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
          <div className="max-w-full flex flex-col lg:flex-row gap-5">
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              {/* Dados da Transação*/}
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex flex-col gap-2 mb-3 justify-between">
                  <span className="flex gap-2 items-center">
                    <Fingerprint />{" "}
                    <span className="text-lg font-bold ">
                      Dados da Transação
                    </span>
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    <div className="flex flex-1 min-w-fit flex-col justify-end">
                      <label className="text-sm font-medium">Descrição</label>
                      <Input
                        value={data.descricao && data.descricao.toUpperCase()}
                        className="flex-1 max-h-10 mt-2"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-1 min-w-fit flex-col justify-end">
                      <label className="text-sm font-medium">Valor</label>
                      <Input
                        value={normalizeCurrency(
                          Math.abs(parseFloat(data.valor || ""))
                        )}
                        className="flex-1 max-h-10 mt-2 text-center"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-1 min-w-fit flex-col justify-end">
                      <label className="text-sm font-medium">
                        ID Transação
                      </label>
                      <Input
                        value={
                          data.id_transacao && data.id_transacao.toUpperCase()
                        }
                        className="flex-1 max-h-10 mt-2"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-1 min-w-fit flex-col justify-end">
                      <label className="text-sm font-medium">Documento</label>
                      <Input
                        value={data.documento && data.documento.toUpperCase()}
                        className="flex-1 max-h-10 mt-2"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-1 min-w-fit flex-col justify-end">
                      <label className="text-sm font-medium">
                        Data Transação
                      </label>
                      <Input
                        value={normalizeDate(data.data_transacao || "")}
                        className="flex-1 max-h-10 mt-2 text-center"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-1 min-w-fit flex-col justify-end">
                      <label className="text-sm font-medium">
                        Conta Bancária
                      </label>
                      <Input
                        value={
                          data.conta_bancaria &&
                          data.conta_bancaria.toUpperCase()
                        }
                        className="flex-1 max-h-10 mt-2"
                        readOnly
                      />
                    </div>
                    <div className="flex flex-1 min-w-fit flex-col justify-end">
                      <label className="text-sm font-medium">Usuário</label>
                      <Input
                        value={normalizeFirstAndLastName(data.usuario || "")}
                        className="flex-1 max-h-10 mt-2"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Dados dos títulos conciliados*/}
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center gap-2 mb-3 justify-between">
                  <span className="flex gap-2 items-center">
                    <List /> <span className="text-lg font-bold ">Títulos</span>
                  </span>
                  <div className="flex gap-2">
                    {modalEditing && (
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
                      id_matriz={data.id_matriz}
                      id_status="3"
                    />
                  </div>
                </div>

                {form.watch("titulos").length > 0 && (
                  <header className="flex py-1 pl-1 pr-5 gap-1 font-medium text-sm">
                    {modalEditing && (
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
                    )}
                    <p className="w-16 text-center">ID</p>
                    <p className="pl-1 w-64">Descrição</p>
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
                  <Badge variant={"dark"} className="font-medium text-base">
                    <p className="me-1">Qtde: </p>
                    {titulos.length}
                  </Badge>
                  <Badge variant={"dark"} className="font-medium text-base">
                    <p className="me-1">Valor Total: </p>
                    {normalizeCurrency(
                      titulos.reduce(
                        (acc, item: TitulosPropsConciliacao) =>
                          acc + +item.valor,
                        0
                      ) || 0
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormConciliacaoCP;
