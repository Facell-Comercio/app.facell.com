import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";

import ModalButtons from "@/components/custom/ModalButtons";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrcamento } from "@/hooks/financeiro/useOrcamento";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useRef, useState } from "react";
import { cadastroSchemaProps, useFormCadastroData } from "./form-data";
import { useStoreCadastro } from "./store";

import { Input } from "@/components/custom/FormInput";
import FormSelectGrupoEconomico from "@/components/custom/FormSelectGrupoEconomico";
import SelectMes from "@/components/custom/SelectMes";
import { dataFormatada } from "./Modal";

const ModalReplicateCadastro = () => {
  const { mutate: insertOne } = useOrcamento().insertOne();
  const modalReplicateOpen = useStoreCadastro().modalReplicateOpen;
  const closeReplicateModal = useStoreCadastro().closeReplicateModal;
  const [refDate, setRefDate] = useState({
    mes: (new Date().getMonth() + 1).toString(),
    ano: new Date().getFullYear().toString(),
  });

  const id = useStoreCadastro().id;
  const formRef = useRef(null);

  const { data, isLoading } = useOrcamento().getOne(id);
  const newData: cadastroSchemaProps & Record<string, any> =
    {} as cadastroSchemaProps & Record<string, any>;

  for (const key in data?.data) {
    if (typeof data?.data[key] === "number") {
      newData[key] = String(data?.data[key]);
    } else if (data?.data[key] === null) {
      newData[key] = "";
    } else {
      newData[key] = data?.data[key];
    }
  }

  const { form } = useFormCadastroData(newData);

  function handleClickCancel() {
    closeReplicateModal();
  }

  function onSubmitData(newData: cadastroSchemaProps) {
    newData.ref = `${refDate.ano}-${refDate.mes}-1`;
    insertOne(newData);

    closeReplicateModal();
  }

  const ref = newData.ref;
  const partesData = ref?.split("-") || dataFormatada.split("-");

  const mes = partesData[1];
  const ano = partesData[0];

  return (
    <div>
      <Dialog
        open={modalReplicateOpen}
        onOpenChange={() => handleClickCancel()}
      >
        <DialogContent>
          <ScrollArea className="max-h-[80vh]">
            {modalReplicateOpen && !isLoading ? (
              <Form {...form}>
                <div className="flex justify-between text-lg font-medium">
                  <span>
                    {newData.grupo_economico
                      ? `Budget: ${mes}/${ano} - ${newData.grupo_economico}`
                      : "Novo Budget"}
                  </span>
                </div>
                <form
                  ref={formRef}
                  onSubmit={form.handleSubmit(onSubmitData)}
                  className="flex gap-2 items-end"
                >
                  <FormSelectGrupoEconomico
                    className="flex-1 min-w-32"
                    name="id_grupo_economico"
                    control={form.control}
                    label="Grupo Econômico"
                    disabled
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
                </form>
              </Form>
            ) : (
              <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
                <Skeleton className="w-full row-span-1" />
                <Skeleton className="w-full row-span-3" />
              </div>
            )}
          </ScrollArea>
          <DialogFooter className="flex gap-2 items-end flex-wrap">
            <ModalButtons
              id={id}
              cancel={() => closeReplicateModal()}
              formRef={formRef}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalReplicateCadastro;
