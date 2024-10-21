import { Badge } from "@/components/ui/badge";
import { Form } from "@/components/ui/form";
import { Fingerprint, List } from "lucide-react";
import { useEffect, useState } from "react";

// Componentes
import { Input } from "@/components/custom/FormInput";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { normalizeCurrency, normalizeDate, normalizeFirstAndLastName } from "@/helpers/mask";
import { useConciliacaoCR } from "@/hooks/financeiro/useConciliacaoCR";
import { useExtratosStore } from "../../../context";
import { useStoreTableConciliacaoCR } from "../tables/store-tables";
import { ConciliacaoCRSchemaProps } from "./ModalConciliar";
import { default as VirtualizedTitulos } from "./VirtualizedRecebimentos";
import VirtualizedTransacoes from "./VirtualizedTransacoes";
import { useFormConciliacaoCRData } from "./form-data";
import { useStoreConciliacaoCR } from "./store";
const FormConciliacaoCR = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: ConciliacaoCRSchemaProps;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const {
    mutate: conciliacaoManual,
    isPending,
    isSuccess,
  } = useConciliacaoCR().conciliacaoManual();

  const closeModal = useStoreConciliacaoCR().closeModal;
  const editIsPending = useStoreConciliacaoCR().editIsPending;

  const contaBancaria = useExtratosStore().contaBancaria;

  const [resetSelections, data_recebimento] = useStoreTableConciliacaoCR((state) => [
    state.resetSelections,
    state.data_recebimento,
  ]);

  useEffect(() => {
    editIsPending(isPending);
    if (isSuccess) {
      resetSelections();
      closeModal();
    }
  }, [isPending, isSuccess]);

  useState<boolean>(false);

  const { form, recebimentos } = useFormConciliacaoCRData(data);
  const transacoes = data.transacoes;

  const totalRecebimentos = form
    .watch("recebimentos")
    .reduce((acc, val) => acc + parseFloat(val.valor_recebido || "0"), 0);
  const totalTransacoes = parseFloat(
    transacoes.reduce((acc, val) => acc + parseFloat(val.valor), 0).toFixed(2)
  );

  // console.log(totalRecebimentos.toFixed(2), totalTransacoes.toFixed(2));

  function onSubmitData(newData: ConciliacaoCRSchemaProps) {
    if (totalRecebimentos.toFixed(2) !== totalTransacoes.toFixed(2)) {
      toast({
        title: "Valores incorretos!",
        description: "O total dos títulos e das transações não são iguais",
        variant: "warning",
      });
      return;
    }

    conciliacaoManual({
      ...newData,
      data_recebimento: data_recebimento,
      id_conta_bancaria: String(contaBancaria?.id || ""),
    });
  }

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmitData)}
        className="flex flex-col gap-2"
      >
        {/* Dados dos títulos conciliados*/}
        {!!id && (
          <div className="flex flex-col flex-1 w-full p-3 bg-slate-200 dark:bg-blue-950 rounded-lg relative">
            <div className="flex items-center gap-2 mb-3 justify-between">
              <span className="flex gap-2 items-center">
                <Fingerprint /> <span className="text-lg font-bold ">Dados da Conciliação</span>
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2">Responsável</label>
                <Input
                  value={normalizeFirstAndLastName(data.responsavel?.toUpperCase() || "")}
                  className="flex-1"
                  readOnly
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2">Tipo de Conciliação</label>
                <Input value={data.tipo} className="flex-1" readOnly />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2">Data da Conciliação</label>
                <Input
                  // @ts-ignore
                  value={normalizeDate(data.data_conciliacao || "")}
                  className="flex-1"
                  readOnly
                />
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col flex-1 w-full p-3 bg-slate-200 dark:bg-blue-950 rounded-lg relative">
          <div className="flex items-center gap-2 mb-3 justify-between">
            <span className="flex gap-2 items-center">
              <List />{" "}
              <span className="text-lg font-bold ">
                {recebimentos.length > 0 ? "Pagamentos e Transações" : "Transações"}
              </span>
            </span>
          </div>
          <div className="w-full grid grid-cols-2 gap-2 relative">
            {recebimentos.length > 0 && (
              <Card className="flex flex-col overflow-hidden">
                <CardHeader className="p-2">
                  <CardTitle className="text-md text-center font-medium">Pagamentos</CardTitle>
                </CardHeader>
                <CardContent className="p-1 overflow-hidden">
                  <VirtualizedTitulos data={recebimentos} />
                </CardContent>
                <CardFooter className="flex justify-end p-2 align-botton">
                  <Badge variant={"secondary"}>
                    <p className="me-1">Valor Total: </p>
                    {normalizeCurrency(totalRecebimentos)}
                  </Badge>
                </CardFooter>
              </Card>
            )}

            <Card className={`flex flex-col ${recebimentos.length === 0 && "col-span-2"}`}>
              <CardHeader className="p-2">
                <CardTitle className="text-md text-center font-medium">Transações</CardTitle>
              </CardHeader>
              <CardContent className="p-1">
                <VirtualizedTransacoes data={transacoes} />
              </CardContent>
              <CardFooter className="flex p-2 mt-auto align-botton">
                <Badge variant={"secondary"}>
                  <p className="me-1">Valor Total: </p>
                  {normalizeCurrency(totalTransacoes)}
                </Badge>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default FormConciliacaoCR;
