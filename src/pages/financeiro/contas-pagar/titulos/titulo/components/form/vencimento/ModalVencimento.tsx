import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { normalizeCurrency } from "@/helpers/mask";
import { Plus, Save } from "lucide-react";
import { useEffect } from "react";
import z from "zod";
import { TituloSchemaProps, vencimentoSchema } from "../../../form-data";
import { calcularDataPrevisaoPagamento } from "../../../helpers/helper";
import { initialStateVencimento, useStoreVencimento } from "./context";

export function ModalVencimento({
  form: formTitulo,
}: {
  form: UseFormReturn<TituloSchemaProps>;
}) {
  const vencimento = useStoreVencimento().vencimento;
  const indexFieldArray = useStoreVencimento().indexFieldArray;

  const modalOpen = useStoreVencimento().modalOpen;
  const toggleModal = useStoreVencimento().toggleModal;

  const form = useForm({
    resolver: zodResolver(vencimentoSchema),
    values: { ...vencimento } || { ...initialStateVencimento.vencimento },
    defaultValues: { ...initialStateVencimento.vencimento },
  });

  const { append: addVencimento, update: updateVencimento } = useFieldArray({
    control: formTitulo.control,
    name: "vencimentos",
  });

  const valorTotalTitulo = parseFloat(
    useWatch({
      name: "valor",
      control: formTitulo.control,
    })
  );
  const valorTotalVencimentos =
    useWatch({
      name: "vencimentos",
      control: formTitulo.control,
    })?.reduce((acc, vencimento) => parseFloat(vencimento.valor) + acc, 0) || 0;

  const vencimentos = useWatch({
    name: "vencimentos",
    control: formTitulo.control,
  });

  // const { formState: { errors } } = form;

  const data_vencimento = form.watch("data_vencimento");
  // Exemplo de testes

  //* Ao abrir o modal, caso não tenha um valor predefinido, irá setar como valor o que falta para completar o valor do título
  useEffect(() => {
    modalOpen &&
      !(parseFloat(form.watch("valor")) > 0) &&
      form.setValue("valor", `${valorTotalTitulo - valorTotalVencimentos}`);
  }, [modalOpen]);

  useEffect(() => {
    form.setValue(
      "data_prevista",
      String(calcularDataPrevisaoPagamento(data_vencimento))
    );
  }, [data_vencimento]);
  const isUpdate = !!vencimento.id;

  const onSubmit = (data: z.infer<typeof vencimentoSchema>) => {
    if (isUpdate) {
      if (indexFieldArray === undefined) {
        toast({
          title: "Vencimento não identificado, feche e abra novamente o popup",
          variant: "destructive",
        });
      } else {
        const totalPrevisto =
          (vencimentos
            ?.filter((_: any, index: number) => index != indexFieldArray)
            .reduce((acc: number, curr: { valor: string }) => {
              return acc + parseFloat(curr.valor);
            }, 0) || 0) + parseFloat(data.valor);
        const dif = totalPrevisto - valorTotalTitulo;
        if (dif > 0) {
          const difFormatada = normalizeCurrency(dif);
          toast({
            variant: "destructive",
            title: `O valor do vencimento excede o valor total em ${difFormatada}.`,
          });
          return;
        }
        updateVencimento(indexFieldArray, { ...data });
      }
    } else {
      const totalPrevisto =
        (vencimentos?.reduce((acc: number, curr: { valor: string }) => {
          return acc + parseFloat(curr.valor);
        }, 0) || 0) + parseFloat(data.valor);
      const dif = totalPrevisto - valorTotalTitulo;
      if (dif > 0) {
        const difFormatada = normalizeCurrency(dif);
        toast({
          variant: "destructive",
          title: `O valor do vencimento excede o valor total em ${difFormatada}.`,
        });
        return;
      }
      addVencimento({
        id: new Date().getTime().toString(),
        data_vencimento: String(data.data_vencimento),
        data_prevista: String(data.data_prevista),
        valor: data.valor,
        cod_barras: data.cod_barras || "",
        qr_code: data.qr_code || "",
      });
    }
    formTitulo.setValue("update_vencimentos", true);
    form.reset();
    toggleModal();
  };

  return (
    <Dialog open={modalOpen} onOpenChange={toggleModal}>
      <DialogContent className="md:max-w-[50vw]">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // @ts-ignore
              form.handleSubmit(onSubmit)();
            }}
          >
            <DialogHeader>
              <DialogTitle>
                {isUpdate ? "Editar Vencimento" : "Adicionar Vencimento"}
              </DialogTitle>
              <DialogDescription>
                Você precisa informar uma data de vencimento e um valor
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 p-3 max-w-full mb-3">
              <div className="flex gap-3 flex-wrap">
                <FormDateInput
                  name="data_vencimento"
                  label="Vencimento"
                  control={form.control}
                />
                <FormDateInput
                  name="data_prevista"
                  label="Prevista"
                  control={form.control}
                  disabled={true}
                />

                <FormInput
                  name="valor"
                  type="number"
                  label="Valor"
                  inputClass="flex-1 w-[20ch]"
                  placeholder="0,00"
                  control={form.control}
                />
              </div>

              <FormInput
                name="cod_barras"
                label="Código de Barras"
                control={form.control}
              />

              <FormInput
                name="qr_code"
                label="PIX Copia e Cola"
                control={form.control}
              />
            </div>

            <DialogFooter>
              <Button variant={isUpdate ? "success" : "default"} type="submit">
                {isUpdate ? (
                  <span className="flex gap-2">
                    <Save size={18} />
                    Salvar
                  </span>
                ) : (
                  <span className="flex gap-2">
                    <Plus size={18} />
                    Adicionar
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
