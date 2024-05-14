import { Badge } from "@/components/ui/badge";
import { Form } from "@/components/ui/form";
import { List } from "lucide-react";
import { useState } from "react";

// Componentes
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { normalizeCurrency } from "@/helpers/mask";
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
  // console.log("RENDER - ConciliacaoCPs:", id);
  // const { mutate: insertOne } = useConciliacaoCP().insertOne();
  // const { mutate: update } = useConciliacaoCP().update();
  // const { mutate: transferTitulos } = useConciliacaoCP().transferTitulos();

  const closeModal = useStoreConciliacaoCP().closeModal;

  useState<boolean>(false);

  const { form, titulos } = useFormConciliacaoCPData(data);
  const transacoes = data.transacoes;

  const totalTitulos = titulos.reduce(
    (acc, val) => acc + parseFloat(val.valor_pago || "0"),
    0
  );
  const totalTransacoes = transacoes.reduce(
    (acc, val) => acc + parseFloat(val.valor),
    0
  );

  function onSubmitData(newData: ConciliacaoCPSchemaProps) {
    // const filteredData: ConciliacaoCPSchemaProps = {
    //   id: newData.id,
    //   titulos: newData.titulos?.filter(
    //     (titulo: TitulosConciliarProps) =>
    //       !data.titulos.find((obj) => obj.id_titulo == titulo.id_titulo)
    //   ),
    // };

    // console.log(filteredData);
    console.log(newData);

    // update(filteredData);

    closeModal();
  }

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
        {/* Dados dos títulos conciliados*/}
        <div className="flex flex-col flex-1 w-full p-3 bg-slate-200 dark:bg-blue-950 rounded-lg relative">
          <div className="flex items-center gap-2 mb-3 justify-between">
            <span className="flex gap-2 items-center">
              <List />{" "}
              <span className="text-lg font-bold ">Títulos e Transações</span>
            </span>
          </div>

          <div className="w-full grid grid-cols-2 gap-2 relative">
            <Card className="flex flex-col h-full">
              <CardHeader className="p-2">
                <CardTitle className="text-md text-center font-medium">
                  Títulos a Pagar
                </CardTitle>
              </CardHeader>
              <CardContent className="p-1">
                {titulos?.length > 0 && (
                  <VirtualizedTitulos
                    canEdit={!!id}
                    data={titulos}
                    form={form}
                  />
                )}
              </CardContent>
              <CardFooter className="flex justify-end p-2 align-botton">
                <Badge>
                  <p className="me-1">Valor Total: </p>
                  {normalizeCurrency(totalTitulos)}
                </Badge>
              </CardFooter>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader className="p-2">
                <CardTitle className="text-md text-center font-medium">
                  Transações Bancárias
                </CardTitle>
              </CardHeader>
              <CardContent className="p-1">
                {transacoes?.length > 0 && (
                  <VirtualizedTransacoes data={transacoes} form={form} />
                )}
              </CardContent>
              <CardFooter className="flex p-2 mt-auto align-botton">
                <Badge>
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
