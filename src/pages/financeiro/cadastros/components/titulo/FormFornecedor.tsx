import FormDateInput from "@/components/custom/FormDate";
import FormInput from "@/components/custom/FormInput";
import FormSelect from "@/components/custom/FormSelect";
import SelectFilial from "@/components/custom/SelectFilial";
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { useTituloPagar } from "@/hooks/useTituloPagar";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact, DollarSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TituloPagar, initialPropsTitulo, useStoreFornecedor } from "./store-fornecedor";
// import { useTituloPagar } from "@/hooks/useTituloPagar";

const schemaTitulo = z
  .object({
    // Dados Fornecedor
  id: z.coerce.number(),
  cnpj: z.string(),
  nome: z.string(),
  razao: z.string(),
  cep: z.string(),
  logradouro: z.string(),
  numero: z.string(),
  complemento: z.string(),
  bairro: z.string(),
  municipio: z.string(),
  uf: z.string(),
  email: z.string(),
  telefone: z.string().refine(v=>v.trim() !=="", {message: "Número de telefone inválido"}).transform(v=>{
    return rand
  }),

  // Dados Bancários
  id_forma_pagamento: z.coerce.number(),
  id_tipo_chave_pix: z.coerce.number(),
  id_banco: z.coerce.number(),
  id_conta: z.coerce.number(),
  chave_pix: z.string(),
  agencia: z.string(),
  dv_agencia: z.string(),
  conta: z.string(),
  dv_conta: z.string(),
  cpf_cnpj_favorecido: z.string(),
  favorecido: z.string(),
  });

const FormFornecedor = ({ id,  }: { id: string | null }) => {

  const modalFornecedorIsEditing = useStoreFornecedor().modalFornecedorIsEditing
  // const setModalFornecedorIsOpen = useStoreFornecedor().setModalFornecedorIsOpen

  console.log('RENDER - Fornecedor:', id)
  const { data, isLoading } = useTituloPagar().useGetOne(id)
  console.log(data);


  const form = useForm<TituloPagar>({
    defaultValues: data?.data || initialPropsTitulo,
    resolver: zodResolver(schemaTitulo),
  });
  // const { setValue } = form;

  // function handleSelectionPlanoContas(item: ItemPlanoContas) {
  //   setValue('id_plano_contas', item.id)
  //   setValue("plano_contas", item.codigo + ' - ' + item.descricao)
  //   setModalPlanoContasOpen(false)
  // }
  // const watchIdFilial = watch('id_filial')
  // const watchDataEmissao = watch('data_emissao')
  // console.log("Data emissão -> ", typeof watchDataEmissao);


  const onSubmit = (data: TituloPagar) => {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  if (isLoading) {
    return <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
      <Skeleton className="w-full row-span-1" />
      <Skeleton className="w-full row-span-3" />
    </div>
  }

  return (
    <div className="max-w-full max-h-[90vh] overflow-x-hidden">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-w-full flex flex-col lg:flex-row gap-5">
            {/* Primeira coluna */}
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex gap-2 mb-3">
                  <Contact /> <span className="text-lg font-bold ">Dados do Fornecedor</span> 
                </div>

                <div className="flex flex-wrap gap-3">
                  <FormInput className="w-64" name="cnpj" readOnly={!modalFornecedorIsEditing} label="CPF/CNPJ" control={form.control} />
                  <FormInput className="min-w-[50ch] shrink-0" name="nome" readOnly={!modalFornecedorIsEditing} label="Nome do fornecedor" control={form.control} />
                  <FormInput className="w-64" name="telefone" readOnly={!modalFornecedorIsEditing} label="Telefone" control={form.control} />
                </div>
              </div>

              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex gap-2 mb-3">
                <DollarSign /> <span className="text-lg font-bold ">Dados Bancários</span>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <FormSelect
                    name="tipo_solicitacao"
                    control={form.control}
                    label={"Tipo de solicitação"}
                    options={[
                      { value: "1", label: "Com nota fiscal" },
                      { value: "2", label: "Antecipado / Nota fiscal futura" },
                      { value: "3", label: "Sem nota fiscal" },
                    ]}
                  />

                  <SelectFilial
                    name="id_filial"
                    label="Filial"
                    control={form.control}
                  />

                  {/* Plano contas */}
                  <FormInput
                    type="hidden"
                    name="id_plano_contas"
                    control={form.control}
                  />
                  <FormItem>
                    <FormLabel>Plano de contas</FormLabel>
                    {/* <Input className="w-[50ch]" readOnly {...form.register('plano_contas')} placeholder="Selecione um plano de contas" onClick={showModalPlanoContas} /> */}
                  </FormItem>



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

                  <FormDateInput name="data_emissao" label="Data de emissão" control={form.control} />
                  <FormDateInput name="data_vencimento" label="Data de vencimento" control={form.control} />

                  <FormInput name="valor" type={"number"} label="Valor do título" control={form.control} />

                  <FormInput className="min-w-[400px]" name="descricao" label="Descrição do pagamento" control={form.control} />
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
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormFornecedor;
