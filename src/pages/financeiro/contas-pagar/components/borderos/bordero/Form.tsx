import FormDateInput from "@/components/custom/FormDate";
import SelectContaBancaria from "@/components/custom/SelectContaBancaria";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useBordero } from "@/hooks/useBordero";
import { Fingerprint, List, Plus } from "lucide-react";
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
  const modalEditing = useStoreBordero().modalEditing;
  const editModal = useStoreBordero().editModal;
  const closeModal = useStoreBordero().closeModal;

  const onSubmitData = (data: BorderoSchemaProps) => {
    console.log(data);

    if (id) update(data);
    if (!id) insertOne(data);

    editModal(false);
    closeModal();
  };

  const { form, titulos, removeTitulo } = useFormBorderoData(data);
  const id_conta_bancaria = form.watch("id_conta_bancaria");
  const data_pagamento = form.watch("data_pagamento");
  console.log(data_pagamento);

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

                <div className="flex flex-wrap gap-3 items-end">
                  <SelectContaBancaria
                    disabled={!modalEditing}
                    name="id_conta_bancaria"
                    control={form.control}
                  />
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
                  {id_conta_bancaria && (
                    <Button>
                      <Plus className="me-2" strokeWidth={2} />
                      Novo Título
                    </Button>
                  )}
                </div>
                {id_conta_bancaria && (
                  <>
                    <header className="flex py-1 pl-1 pr-2 gap-1 font-medium text-sm">
                      <p className="flex-1 max-w-[16px]"></p>
                      <p className="pl-1 w-16">ID</p>
                      <p className="flex-1 pl-1">Fornecedor</p>
                      <p className="pl-1 w-24">Nº Doc</p>
                      <p className="pl-1 w-24">Valor</p>
                      <p className="flex-1 pl-1">Filial</p>
                      <p className="pl-1 w-24">Vencimento</p>
                      <p className="flex-1 pl-1 max-w-[52px]">Ação</p>
                      {/* <p className="flex-1"></p> */}
                    </header>
                    <div className="flex gap-3 flex-wrap">
                      <RowVirtualizerFixed
                        data={titulos}
                        form={form}
                        modalEditing={modalEditing}
                        removeItem={removeTitulo}
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
