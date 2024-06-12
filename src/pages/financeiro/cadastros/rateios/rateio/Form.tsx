import AlertPopUp from "@/components/custom/AlertPopUp";
import FormInput from "@/components/custom/FormInput";
import FormSelectGrupoEconomico from "@/components/custom/FormSelectGrupoEconomico";
import FormSwitch from "@/components/custom/FormSwitch";
import SelectFilial from "@/components/custom/SelectFilial";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { useRateios } from "@/hooks/financeiro/useRateios";
import { Fingerprint, Percent, Trash } from "lucide-react";
import { useEffect } from "react";
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
  const {
    mutate: insertOne,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
    isError: insertIsError,
  } = useRateios().insertOne();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
    isError: updateIsError,
  } = useRateios().update();
  const { mutate: deleteOne } = useRateios().deleteOne();

  const [modalEditing, editModal, closeModal, editIsPending, isPending] =
    useStoreRateios((state) => [
      state.modalEditing,
      state.editModal,
      state.closeModal,
      state.editIsPending,
      state.isPending,
    ]);

  const { form, itens, appendItem, removeItem } = useFormRateioData(data);
  // ! Verificar a existênicia de erros
  // console.log(form.formState.errors);

  function addNewRateio() {
    appendItem({
      id_filial: "",
      percentual: "0",
    });
  }

  function removeItemRateio(index: number, id: number | undefined | null) {
    removeItem(index);
    id && deleteOne(id);
  }
  const manual = form.watch("manual");
  const id_grupo_economico = form.watch("id_grupo_economico");
  const isManual = +manual;

  const onSubmitData = (newData: RateiosSchema) => {
    const soma = newData.itens.reduce(
      (cont, submitedData) =>
        parseFloat((parseFloat(submitedData.percentual) + cont).toFixed(4)),
      0
    );

    // console.log(newData);
    // console.log(new Set(filiais).size !== filiais.length);

    const filiais = newData.itens.map((data) => data.id_filial);
    if (new Set(filiais).size !== filiais.length) {
      toast({
        title: "Atenção!",
        description: `Existem filiais repetidas`,
        variant: "warning",
      });
      return;
    }

    if (!isManual && soma.toFixed(4) != (1.0).toFixed(4)) {
      toast({
        title: "Erro!",
        description: `A soma dos percentuais deve ser igual a 100% mas está em ${(
          soma * 100
        ).toFixed(2)}%`,
      });
      return;
    }
    id && update(newData);
    !id && insertOne(newData);
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
                    <span className="text-lg font-bold ">Dados do rateio</span>
                  </div>
                  <span className="flex gap-4">
                    <FormSwitch
                      name="manual"
                      disabled={!modalEditing || isPending}
                      label="Manual"
                      control={form.control}
                    />
                    <FormSwitch
                      name="active"
                      disabled={!modalEditing || isPending}
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
                    readOnly={!modalEditing || isPending}
                    label="Código"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[40ch]"
                    name="nome"
                    readOnly={!modalEditing || isPending}
                    label="Nome"
                    control={form.control}
                  />
                  <FormSelectGrupoEconomico
                    className="min-w-32"
                    name="id_grupo_economico"
                    disabled={!modalEditing || isPending}
                    label="Grupo Econômico"
                    control={form.control}
                  />

                  {!isManual && (
                    <section className="w-full flex justify-between mt-2">
                      <p className="text-lg font-medium">Rateios</p>
                      <Button
                        type="button"
                        onClick={() => addNewRateio()}
                        disabled={!modalEditing || isPending}
                      >
                        Adicionar Item
                      </Button>
                    </section>
                  )}

                  {!isManual && (
                    <ScrollArea className="flex w-full max-h-96 sm:pr-3">
                      {itens.map((item, index) => {
                        return (
                          <div className="flex gap-2 py-1" key={item.id}>
                            <SelectFilial
                              className="min-w-32 h-9"
                              name={`itens.${index}.id_filial`}
                              disabled={!modalEditing || isPending}
                              control={form.control}
                              id_grupo_economico={id_grupo_economico}
                            />
                            <FormInput
                              type="number"
                              className="flex-1 max-w-[20ch] h-9"
                              readOnly={!modalEditing || isPending}
                              name={`itens.${index}.percentual`}
                              control={form.control}
                              icon={Percent}
                              step={"0.0001"}
                              inputClass="h-9"
                              iconClass="h-9"
                              min={0.0001}
                              max={100}
                            />
                            <AlertPopUp
                              title="Deseja realmente remover?"
                              description="O item será removido definitivamente deste rateio, podendo ser incluido novamente."
                              action={() =>
                                removeItemRateio(index, item.id_item)
                              }
                            >
                              <Button
                                type="button"
                                size={"sm"}
                                variant={"destructive"}
                                disabled={!modalEditing || isPending}
                              >
                                <Trash size={18} />
                              </Button>
                            </AlertPopUp>
                          </div>
                        );
                      })}
                      <ScrollBar />
                    </ScrollArea>
                  )}
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
