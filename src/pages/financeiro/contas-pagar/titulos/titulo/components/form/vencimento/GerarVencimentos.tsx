import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UseFormReturn,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";

import FormDateInput from "@/components/custom/FormDate";
import FormInput from "@/components/custom/FormInput";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import {
  checkUserDepartments,
  checkUserPermission,
} from "@/helpers/checkAuthorization";
import { normalizeCurrency } from "@/helpers/mask";
import { addMonths, startOfDay, subDays } from "date-fns";
import { ListPlus, Play } from "lucide-react";
import { useEffect, useState } from "react";
import z from "zod";
import { TituloSchemaProps } from "../../../form-data";
import {
  calcularDataPrevisaoPagamento,
  checkIsCartao,
  proximoDiaUtil,
} from "../../../helpers/helper";
import { VencimentoTitulo } from "../../../store";

export function ModalGerarVencimentos({
  form: formTitulo,
}: {
  form: UseFormReturn<TituloSchemaProps>;
}) {
  const isMaster: boolean =
    checkUserPermission("MASTER") || checkUserDepartments("FINANCEIRO");
  // WATCH TÍTULO:
  const valorTotalTitulo = useWatch({
    name: "valor",
    control: formTitulo.control,
  });
  const vencimentos = useWatch({
    name: "vencimentos",
    control: formTitulo.control,
  });

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const schema = z.object({
    data_vencimento: z.coerce.date(),
    parcelas: z.coerce.number().min(1, "Parcela precisa ser >= 1"),
    valor: z.coerce.number().min(0.01, "Valor precisa ser >= R$ 0,01"),
  });
  const data_inicial = formTitulo.watch("data_emissao");
  const id_forma_pagamento = formTitulo.watch("id_forma_pagamento");
  const isCartao = checkIsCartao(id_forma_pagamento);
  const initialValues = {
    data_vencimento: startOfDay(data_inicial).toDateString(),
    parcelas: "1",
    valor: "0",
  };

  // * FORM GERAÇÃO DE VENCIMENTOS
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ...initialValues },
  });

  const { append: addVencimento } = useFieldArray({
    control: formTitulo.control,
    name: "vencimentos",
  });

  // const { formState: { errors } } = form;
  // console.log({
  //     erros_gerar_vencimentos: errors
  // })

  const diaVencimentoCartao = parseInt(
    useWatch({ name: "dia_vencimento_cartao", control: formTitulo.control }) ||
      "0"
  );
  const diaCorteCartao = parseInt(formTitulo.watch("dia_corte_cartao") || "0");

  useEffect(() => {
    if (isCartao) {
      const year = startOfDay(data_inicial).getFullYear();
      const month = startOfDay(data_inicial).getMonth();

      if (startOfDay(data_inicial).getDate() > diaCorteCartao) {
        form.setValue(
          "data_vencimento",
          new Date(year, month + 2, diaVencimentoCartao).toDateString()
        );
      } else {
        form.setValue(
          "data_vencimento",
          new Date(year, month + 1, diaVencimentoCartao).toDateString()
        );
      }
    }
  }, [data_inicial, diaVencimentoCartao]);

  type GeradorVencimentos = {
    data_vencimento: string;
    parcelas: string;
    valor: string;
  };

  const onSubmit = (data: GeradorVencimentos) => {
    let dataVencimento = data.data_vencimento || new Date();
    let valorParcela = parseFloat(data.valor) || 0;
    let qtdeParcelas = parseFloat(data.parcelas) || 0;

    const valorTotalParcelas = valorParcela * qtdeParcelas;
    const totalVencimentos =
      vencimentos?.reduce((acc: number, curr: VencimentoTitulo) => {
        return acc + parseFloat(curr.valor);
      }, 0) || 0;
    const totalTitulo = parseFloat(valorTotalTitulo);

    const excesso = totalVencimentos + valorTotalParcelas - totalTitulo;
    if (excesso >= 0.01) {
      toast({
        variant: "destructive",
        title: `Impedimento`,
        description: `O valor total seria excedido em ${normalizeCurrency(
          excesso
        )}`,
      });
      return;
    }
    for (let parcela = 0; parcela < qtdeParcelas; parcela++) {
      let obj = {
        id: new Date().getTime().toString(),
        data_vencimento: "",
        data_prevista: "",
        valor: valorParcela.toString(),
        cod_barras: "",
        qr_code: "",
      };

      // gerar uma data de vencimento e previsão
      if (parcela == 0) {
        obj.data_vencimento = data.data_vencimento;
        if (!isCartao) {
          obj.data_vencimento = proximoDiaUtil(obj.data_vencimento).toString();
        }
        obj.data_prevista = calcularDataPrevisaoPagamento(
          data.data_vencimento
        ).toDateString();
      } else {
        obj.data_vencimento = addMonths(dataVencimento, parcela).toString();
        if (!isCartao) {
          obj.data_vencimento = proximoDiaUtil(obj.data_vencimento).toString();
        }
        obj.data_prevista = calcularDataPrevisaoPagamento(
          obj.data_vencimento
        ).toDateString();
      }

      // incluir um item ao fieldArray
      addVencimento(obj);
    }
    formTitulo.setValue("update_vencimentos", true);
    setModalOpen(false);
    form.reset();
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button variant="tertiary" size={"sm"}>
          <ListPlus size={18} className="me-2" /> Gerar Vencimentos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[50vw]">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              form.handleSubmit(onSubmit)(e);
              e.stopPropagation();
            }}
          >
            <DialogHeader>
              <DialogTitle>Gerar Vencimentos</DialogTitle>
              <DialogDescription>
                Defina o primeiro vencimento, quantidade de parcelas e valor da
                parcela e os vencimentos serão gerados automaticamente. <br />
                Caso o valor de uma das parcelas seja diferente, você pode gerar
                essa parcela diferente manualmente.
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-3 p-3 flex-wrap max-w-full mb-3">
              <FormDateInput
                name="data_vencimento"
                label="Primeiro Vencimento"
                control={form.control}
                min={!isMaster ? subDays(new Date(), 1) : undefined}
                disabled={checkIsCartao(id_forma_pagamento)}
              />

              <FormInput
                name="parcelas"
                type="number"
                label="Quantidade de Parcelas"
                step="1"
                min={1}
                max={9999}
                control={form.control}
              />
              <FormInput
                name="valor"
                type="number"
                label="Valor da parcela"
                inputClass="w-[20ch]"
                control={form.control}
              />
            </div>

            <DialogFooter>
              <Button variant={"tertiary"} type="submit">
                <Play size={18} className="me-2" /> Gerar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
