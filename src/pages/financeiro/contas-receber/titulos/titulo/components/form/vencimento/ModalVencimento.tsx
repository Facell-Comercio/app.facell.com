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
import { UseFormReturn, useFieldArray, useForm, useWatch } from "react-hook-form";

import AlertPopUp from "@/components/custom/AlertPopUp";
import FormDateInput from "@/components/custom/FormDate";
import FormInput from "@/components/custom/FormInput";
import { Form } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { checkUserDepartments, checkUserPermission } from "@/helpers/checkAuthorization";
import { normalizeCurrency, normalizeDate, normalizeFirstAndLastName } from "@/helpers/mask";
import { useTituloReceber } from "@/hooks/financeiro/useTituloReceber";
import { subDays } from "date-fns";
import { Plus, Save, Trash } from "lucide-react";
import { useEffect, useMemo } from "react";
import { TbCurrencyReal } from "react-icons/tb";
import z from "zod";
import { TituloCRSchemaProps, vencimentoSchema } from "../../../form-data";
import { initialStateVencimento, useStoreVencimento } from "./context";

export function ModalVencimento({
  form: formTitulo,
}: {
  form: UseFormReturn<TituloCRSchemaProps>;
}) {
  const id_status = parseInt(formTitulo.watch("id_status") || "0");
  const emitido = id_status === 30;
  const pagoParcial = id_status === 40;
  const canEdit = id_status < 30 && id_status !== 20;
  const canEditRecebimento = pagoParcial || emitido;
  const isMaster: boolean = checkUserPermission("MASTER") || checkUserDepartments("FINANCEIRO");
  const vencimento = useStoreVencimento().vencimento;
  const indexFieldArray = useStoreVencimento().indexFieldArray;
  // console.log("VENCIMENTO", vencimento);

  const { mutate: deleteRecebimento } = useTituloReceber().deleteRecebimento();

  const [modalOpen, toggleModal] = useStoreVencimento((state) => [
    state.modalOpen,
    state.toggleModal,
  ]);

  const id_vencimento = useMemo(() => vencimento.id, [vencimento.id, modalOpen]) || "";
  const { data: recebimentos } = useTituloReceber().getAllRecebimentosVencimento(id_vencimento);

  const form = useForm({
    resolver: zodResolver(vencimentoSchema),
    values: vencimento ? { ...vencimento } : { ...initialStateVencimento.vencimento },
    defaultValues: { ...initialStateVencimento.vencimento },
  });

  const { append: addVencimento, update: updateVencimento } = useFieldArray({
    control: formTitulo.control,
    name: "vencimentos",
  });

  // * WATCHES
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

  //* Ao abrir o modal, caso não tenha um valor predefinido, irá setar como valor o que falta para completar o valor do título
  useEffect(() => {
    modalOpen &&
      !(parseFloat(form.watch("valor")) > 0) &&
      form.setValue("valor", `${valorTotalTitulo - valorTotalVencimentos}`);
  }, [modalOpen]);

  const handleChangeVencimento = (val: Date) => {
    form.setValue("data_vencimento", String(val));
  };
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
        if (dif > 0 && totalPrevisto.toFixed(2) != valorTotalTitulo.toFixed(2)) {
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
      if (dif > 0 && totalPrevisto.toFixed(2) != valorTotalTitulo.toFixed(2)) {
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
        valor: data.valor,
      });
    }
    formTitulo.setValue("update_vencimentos", true);
    form.reset();
    toggleModal();
  };

  return (
    <Dialog open={modalOpen} onOpenChange={toggleModal}>
      <DialogContent className={`${recebimentos ? "md:max-w-[70vw]" : "md:max-w-[50vw]"}`}>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              // @ts-ignore
              form.handleSubmit(onSubmit)(e);
              e.stopPropagation();
            }}
          >
            <DialogHeader>
              <DialogTitle>{isUpdate ? "Editar Vencimento" : "Adicionar Vencimento"}</DialogTitle>
              <DialogDescription>
                Você precisa informar uma data de vencimento e um valor
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 py-3 max-w-full mb-3">
              <div className="flex gap-3 flex-wrap">
                <FormDateInput
                  name="data_vencimento"
                  label="Vencimento"
                  min={!isMaster ? subDays(new Date(), 1) : undefined}
                  control={form.control}
                  disabled={emitido || !canEdit}
                  onChange={(val) => handleChangeVencimento(val)}
                />

                <FormInput
                  icon={TbCurrencyReal}
                  iconClass="bg-secondary"
                  iconLeft
                  name="valor"
                  type="number"
                  label="Valor"
                  inputClass="flex-1 w-[20ch]"
                  placeholder="0,00"
                  min={0}
                  control={form.control}
                  disabled={emitido || !canEdit}
                />
              </div>
              {canEditRecebimento && (
                <div className="flex flex-col gap-2">
                  {/* <p className="font-medium w-full text-center">Recebimentos</p> */}
                  <Table
                    className="rounded-md border-border w-full h-10 overflow-clip relative"
                    divClassname="overflow-auto scroll-thin max-h-[40vh] border rounded-md text-nowrap"
                  >
                    <TableHeader className="sticky w-full top-0 h-10 border-b-2 border-border rounded-t-md bg-secondary">
                      <TableRow>
                        <TableHead>Ação</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Conta Bancária</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Criador</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recebimentos &&
                        recebimentos.map((row: any, index: number) => (
                          <TableRow
                            key={`recebimentos: ${index} - ${row.id}`}
                            className="uppercase odd:bg-secondary/60 even:bg-secondary/40"
                          >
                            <TableCell className="flex gap-2">
                              <AlertPopUp
                                title="Deseja realmente remover este recebimento?"
                                description=""
                                action={() => deleteRecebimento(row.id)}
                                children={
                                  <Button type="button" variant="destructive" size={"xs"}>
                                    <Trash size={16} />
                                  </Button>
                                }
                              />
                            </TableCell>
                            <TableCell>{normalizeDate(row.data)}</TableCell>
                            <TableCell>{row.conta_bancaria}</TableCell>
                            <TableCell>{normalizeCurrency(row.valor)}</TableCell>
                            <TableCell>{normalizeFirstAndLastName(row.usuario)}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            <DialogFooter>
              {canEdit && (
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
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
