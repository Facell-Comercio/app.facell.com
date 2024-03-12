import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormInput from "@/components/ui/form-input";
import FormSelect from "@/components/ui/form-select";
import { toast } from "@/components/ui/use-toast";
import { Contact, Divide, DollarSign, FileIcon, FileText, HandCoins, Save } from "lucide-react";
import { useState } from "react";
import { useRateio } from "./store-titulo-pagar";

const schema = z
  .object({
    tipo_solicitacao: z.string(),
    descricao: z.string().min(10, { message: "Precisa conter mais que 10 caracteres" }),
    nota_fiscal: z.any(),
  })
  .superRefine((values, ctx) => {
    console.log("Valores no superRefine", values);
    if (values.tipo_solicitacao === "1" && !values.nota_fiscal) {
      ctx.addIssue({
        path: ["nota_fiscal"],
        code: z.ZodIssueCode.custom,
        message: "Nota fiscal é obrigatória para esse tipo de solicitação!",
        fatal: true,
      });
    }
  });

const FormTituloPagar = (props) => {
  const { itensRateio, removeItemRateio, addItemRateio, limparRateio } = useRateio();

  const form = useForm({
    defaultValues: {
      tipo_solicitacao: "1",
      descricao: "",
      nota_fiscal: "",
    },
    resolver: zodResolver(schema),
  });

  const addNovoItemRateio = () => {
    addItemRateio({ filial: "ALEX", valor: 40.2, percentual: 0.5 });
  };

  const onSubmit = (data) => {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full flex gap-5 p-5">
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex gap-2 mb-3">
                  <Contact /> <span className="text-lg font-bold ">Fornecedor</span>
                </div>

                <div className="flex gap-3">
                  <FormInput className="w-64" name="cpf_cnpj" readOnly={true} label="CPF/CNPJ" control={form.control} />
                  <FormInput className="max-w-[500px]" name="nome" readOnly={true} label="Nome do fornecedor" control={form.control} />
                </div>
              </div>

              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex gap-2 mb-3">
                  <FileText /> <span className="text-lg font-bold ">Dados do título</span>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <FormSelect
                    name="tipo_solicitacao"
                    control={form.control}
                    label={"Tipo de solicitação"}
                    options={[
                      { value: "1", label: "Com nota fiscal" },
                      { value: "2", label: "Antecipado com nota fiscal" },
                      { value: "3", label: "Sem nota fiscal" },
                    ]}
                  />

                  <FormSelect
                    className={"min-w-[40ch]"}
                    name="filial"
                    control={form.control}
                    label={"Filial"}
                    options={[
                      { value: "1", label: "01 TIM MIDWAY" },
                      { value: "2", label: "02 TIM NATAL SHOPPING" },
                      { value: "3", label: "08 TIM NORTE SHOPPING" },
                    ]}
                  />

                  <FormSelect
                    name="plano_contas"
                    className={"min-w-[30ch]"}
                    control={form.control}
                    label={"Plano de contas"}
                    options={[
                      { value: "08.09", label: "Material de expediente" },
                      { value: "05.05", label: "Salários" },
                      { value: "07.08", label: "Benefícios" },
                    ]}
                  />

                  <FormSelect
                    name="centro_custo"
                    control={form.control}
                    label={"Centro de custo"}
                    className={"min-w-[30ch]"}
                    options={[
                      { value: "1", label: "DIRETORIA" },
                      { value: "2", label: "DP" },
                      { value: "3", label: "COMERCIAL" },
                    ]}
                  />

                  <FormSelect
                    name="forma_pagamento"
                    control={form.control}
                    label={"Forma de pagamento"}
                    className={"min-w-[30ch]"}
                    options={[
                      { value: "1", label: "Boleto" },
                      { value: "2", label: "Débito em conta" },
                      { value: "3", label: "Dinheiro" },
                      { value: "4", label: "PIX" },
                      { value: "5", label: "Transferência" },
                      { value: "6", label: "Cartão" },
                      { value: "7", label: "Câmbio Invoice" },
                      { value: "8", label: "Débito automático" },
                    ]}
                  />

                  <FormInput name="parcelas" type={"number"} label="Número de parcelas" control={form.control} />
                  <FormInput name="data_emissao" type={"date"} label="Data de emissão" control={form.control} />
                  <FormInput name="data_vencimento" type={"date"} label="Data de vencimento" control={form.control} />

                  <FormInput name="valor" type={"number"} label="Valor do título" control={form.control} />

                  <FormInput className="min-w-[400px]" name="descricao" label="Descrição do pagamento" control={form.control} />
                </div>
              </div>

              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex gap-2 mb-3">
                  <Divide /> <span className="text-lg font-bold ">Dados do rateio</span>
                </div>

                <div className="flex gap-3">
                  <FormSelect
                    name="tipo_rateio"
                    control={form.control}
                    label={"Tipo de rateio"}
                    className={"min-w-[30ch]"}
                    options={[
                      { value: "6", label: "R08 - RATEIO MANUAL" },
                      { value: "1", label: "R01 - RATEIO REGIONAL RN" },
                      { value: "2", label: "R02 - RATEIO REGIONAL CE" },
                      { value: "3", label: "R03 - RATEIO REGIONAL BA" },
                      { value: "4", label: "R05 - TODAS FILIAIS" },
                      { value: "5", label: "R07 - RATEIO REGIONAL RN/CE" },
                    ]}
                  />
                </div>

                <div className="flex justify-between items-baseline border mt-3">
                  <FormLabel>Itens do rateio</FormLabel>
                  <Button
                    type="button"
                    onClick={() => {
                      addNovoItemRateio();
                    }}
                  >
                    Novo item
                  </Button>
                </div>
                <div className="flex flex-col gap-3 mt-3">
                  {itensRateio?.map((itemRateio, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <Input  readOnly={true} value={itemRateio.filial}/>

                      <Input className="w-60" type="number" value={itemRateio.percentual} />
                      <Input className="w-60" type="number" value={itemRateio.valor} />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={()=>{removeItemRateio(index)}}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex gap-2 mb-3">
                  <DollarSign /> <span className="text-lg font-bold ">Dados do pagamento</span>
                </div>
                <div className="flex gap-3">pagamento aqui</div>
              </div>

              {/* Fim da primeira coluna */}
            </div>

            <div className="bg-slate-200 dark:bg-blue-950 p-3 rounded-lg">
              <div className="flex gap-2 font-bold mb-3">
                <FileIcon /> <span>Anexos</span>
              </div>

              <FormInput name="xml" type="file" label="XML Nota fiscal" control={form.control} />
              <FormInput name="nota_fiscal" type="file" label="Nota fiscal" control={form.control} />
              <FormInput name="boleto" type="file" label="Boleto" control={form.control} />
              <FormInput name="contrato" type="file" label="Contrato/Ordem de compra" control={form.control} />
              <FormInput name="planilha" type="file" label="Planilha" control={form.control} />
              <FormInput name="txt" type="file" label="TXT Remessa" control={form.control} />
            </div>
          </div>
          <div className="flex justify-end p-5">
            <Button type="submit" size="lg">
              <Save className="me-2" />
              Salvar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormTituloPagar;
