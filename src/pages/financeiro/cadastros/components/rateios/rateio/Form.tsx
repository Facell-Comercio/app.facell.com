import FormInput from "@/components/custom/FormInput";
import FormSelectGrupoEconomico from "@/components/custom/FormSelectGrupoEconomico";
import FormSwitch from "@/components/custom/FormSwitch";
import SelectFilial from "@/components/custom/SelectFilial";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { useRateios } from "@/hooks/useRateios";
import { Fingerprint, Percent, Trash } from "lucide-react";
import { RateiosSchema } from "./Modal";
import { useFormRateioData } from "./form-data";
import { useStoreRateios } from "./store";

const FormRateios = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: RateiosSchema;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  console.log("RENDER - Rateios:", id);
  const { mutate: insertOne } = useRateios().insertOne();
  const { mutate: update } = useRateios().update();
  const modalEditing = useStoreRateios().modalEditing;
  const editModal = useStoreRateios().editModal;
  const closeModal = useStoreRateios().closeModal;

  const { form, itens, appendItem, removeItem } = useFormRateioData(data);

  const onSubmitData = (newData: RateiosSchema) => {
    const soma = newData.itens.reduce((cont, submitedData) => {
      return parseFloat(submitedData.percentual) + cont;
    }, 0);

    // Arredonda a soma para duas casas decimais
    const somaArredondada = parseFloat(soma.toFixed(4));

    toast({
      title: "DATA",
      description: `${somaArredondada} ${JSON.stringify(newData)}`,
    });

    // if (somaArredondada === 1.0) {
    if (id) update(newData);
    if (!id) insertOne(newData);
    editModal(false);
    closeModal();
    // } else {
    //   alert("A soma dos percentuais deve ser igual a 100%");
    // }
  };

  function addNewRateio() {
    appendItem({
      id_filial: "",
      percentual: "0",
    });
  }
  function removeItemRateio(index: number) {
    removeItem(index);
  }
  const manual = form.watch("manual");
  const isManual = +manual;

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
                    <span className="text-lg font-bold ">
                      Dados do rateio
                    </span>
                  </div>
                  <span className="flex gap-4">
                    <FormSwitch
                      name="manual"
                      disabled={!modalEditing}
                      label="Manual"
                      control={form.control}
                    />
                    <FormSwitch
                      name="active"
                      disabled={!modalEditing}
                      label="Ativo"
                      control={form.control}
                    />
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <FormInput
                    name="id"
                    type="hidden"
                    label="ID"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-40"
                    name="codigo"
                    readOnly={!modalEditing}
                    label="Código"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[40ch]"
                    name="nome"
                    readOnly={!modalEditing}
                    label="Nome"
                    control={form.control}
                  />
                  <FormSelectGrupoEconomico
                    className="min-w-32"
                    name="id_grupo_economico"
                    disabled={!modalEditing}
                    label="Grupo Econômico"
                    control={form.control}
                  />

                  {!isManual && (
                    <section className="w-full flex justify-between mt-2">
                      <p className="text-lg font-medium">Rateios</p>
                      <Button
                        type="button"
                        onClick={() => addNewRateio()}
                        disabled={!modalEditing}
                      >
                        Adicionar Rateio
                      </Button>
                    </section>
                  )}

                  {!isManual  && (
                  <ScrollArea className="flex w-[98%] mx-auto max-h-96 pr-3">
                    {itens.map((item, index) => {
                        return (
                          <div
                            className="flex gap-2 py-1 items-end "
                            key={item.id}
                          >
                            <SelectFilial
                              className="min-w-32"
                              name={`itens.${index}.id_filial`}
                              disabled={!modalEditing}
                              label="Filial"
                              control={form.control}
                            />
                            <FormInput
                              type="number"
                              className="flex-1 max-w-[20ch]"
                              readOnly={!modalEditing}
                              name={`itens.${index}.percentual`}
                              label="Percentual"
                              control={form.control}
                              icon={Percent}
                              min={0.1}
                              max={99}
                            />
                            <Button
                              type="button"
                              variant={"destructive"}
                              disabled={!modalEditing}
                              onClick={() => removeItemRateio(index)}
                            >
                              <Trash />
                            </Button>
                          </div>
                        );
                      })}
                    <ScrollBar />
                  </ScrollArea>
                  )
                  }
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormRateios;
