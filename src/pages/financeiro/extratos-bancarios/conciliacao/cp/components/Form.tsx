import { Badge } from "@/components/ui/badge";
import { Form } from "@/components/ui/form";
import { Fingerprint, List } from "lucide-react";
import { useEffect, useState } from "react";

// Componentes
import { Input } from "@/components/custom/FormInput";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import {
  normalizeCurrency,
  normalizeDate,
  normalizeFirstAndLastName,
} from "@/helpers/mask";
import { useConciliacaoCP } from "@/hooks/financeiro/useConciliacaoCP";
import { useStoreTableConciliacaoCP } from "../tables/store-tables";
import { ConciliacaoCPSchemaProps } from "./ModalConciliar";
import { default as VirtualizedTitulos } from "./VirtualizedTitulos";
import VirtualizedTransacoes from "./VirtualizedTransacoes";
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
  console.log("RENDER - ConciliacaoCPs:", id);
  const {
    mutate: conciliacaoManual,
    isPending,
    isSuccess,
  } = useConciliacaoCP().conciliacaoManual();

  const closeModal = useStoreConciliacaoCP().closeModal;
  const editIsPending = useStoreConciliacaoCP().editIsPending;

  const [resetSelections, data_pagamento, id_conta_bancaria] =
    useStoreTableConciliacaoCP((state) => [
      state.resetSelections,
      state.data_pagamento,
      state.filters.id_conta_bancaria,
    ]);

  useEffect(() => {
    editIsPending(isPending);
    if (isSuccess) {
      resetSelections();
      closeModal();
    }
  }, [isPending, isSuccess]);

  useState<boolean>(false);

  const { form, vencimentos } = useFormConciliacaoCPData(data);
  const transacoes = data.transacoes;

  const totalVencimentos = form
    .watch("vencimentos")
    .reduce((acc, val) => acc + parseFloat(val.valor_pago || "0"), 0);
  const totalTransacoes = transacoes.reduce(
    (acc, val) => acc + parseFloat(val.valor),
    0
  );

  function onSubmitData(newData: ConciliacaoCPSchemaProps) {
    if (totalVencimentos !== totalTransacoes) {
      toast({
        title: "Valores incorretos!",
        description: "O total dos títulos e das transações não são iguais",
        variant: "warning",
      });
      return;
    }
    // console.log(newData, "CONCILIADO");

    conciliacaoManual({
      ...newData,
      data_pagamento: data_pagamento,
      id_conta_bancaria,
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
                <Fingerprint />{" "}
                <span className="text-lg font-bold ">Dados da Conciliação</span>
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2">Responsável</label>
                <Input
                  value={normalizeFirstAndLastName(
                    data.responsavel?.toUpperCase() || ""
                  )}
                  className="flex-1"
                  readOnly
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2">
                  Tipo de Conciliação
                </label>
                <Input value={data.tipo} className="flex-1" readOnly />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2">
                  Data da Conciliação
                </label>
                <Input
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
                Pagamentos e Transações
              </span>
            </span>
          </div>
          <div className="w-full grid grid-cols-2 gap-2 relative">
            <Card className="flex flex-col  overflow-hidden">
              <CardHeader className="p-2">
                <CardTitle className="text-md text-center font-medium">
                  Pagamentos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-1 overflow-hidden">
                <VirtualizedTitulos
                  canEdit={!!id}
                  data={vencimentos}
                  form={form}
                />
              </CardContent>
              <CardFooter className="flex justify-end p-2 align-botton">
                <Badge variant={"secondary"}>
                  <p className="me-1">Valor Total: </p>
                  {normalizeCurrency(totalVencimentos)}
                </Badge>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader className="p-2">
                <CardTitle className="text-md text-center font-medium">
                  Transações
                </CardTitle>
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

export default FormConciliacaoCP;
