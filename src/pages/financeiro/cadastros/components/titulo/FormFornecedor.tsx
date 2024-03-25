import FormInput from "@/components/custom/FormInput";
import FormSelect from "@/components/custom/FormSelect";
import SelectFormaPagamento from "@/components/custom/SelectFormaPagamento";
import SelectTipoChavePix from "@/components/custom/SelectTipoChavePix";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { normalizeCnpjNumber, normalizePhoneNumber } from "@/helpers/mask";
import { useTituloPagar } from "@/hooks/useTituloPagar";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact, DollarSign } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useStoreFornecedor } from "./store-fornecedor";
// import { useTituloPagar } from "@/hooks/useTituloPagar";

const schemaFornecedor = z
  .object({
    // Dados Fornecedor
  id: z.string().optional(),
  cnpj: z.string().refine(v=>v.trim() !=="", {message: "Número de telefone inválido"}).transform(v=>normalizeCnpjNumber(v)),
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
  telefone: z.string().refine(v=>v.trim() !=="", {message: "Número de telefone inválido"}).transform(v=>normalizePhoneNumber(v)),

  // Dados Bancários
  id_forma_pagamento: z.string(),
  id_tipo_chave_pix: z.string(),
  id_banco: z.string(),
  chave_pix: z.string(),
  agencia: z.string(),
  dv_agencia: z.string(),
  conta: z.string(),
  dv_conta: z.string(),
  cnpj_favorecido: z.string(),
  favorecido: z.string(),
  });

const FormFornecedor = ({ id,  }: { id: string | null }) => {
  console.log('RENDER - Fornecedor:', id)
  // const [formaPagamento, setFormaPagamento] = useState("");

  const modalEditing = useStoreFornecedor().modalEditing
  const { data, isLoading } = useTituloPagar().useGetOne(id)
  console.log(data);

  type fornecedorSchema = z.infer<typeof schemaFornecedor> 

  const initialPropsFornecedor: fornecedorSchema = {
    // Dados Fornecedor
    id: "",
    cnpj: "",
    nome: "",
    razao: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    municipio: "",
    uf: "",
    email: "",
    telefone: "",
  
    // Dados Bancários
    id_forma_pagamento: "",
    id_tipo_chave_pix: "",
    id_banco: "",
    chave_pix: "",
    agencia: "",
    dv_agencia: "",
    conta: "",
    dv_conta: "",
    cnpj_favorecido: "",
    favorecido: "",
 }

  const form = useForm<fornecedorSchema>({
    resolver: zodResolver(schemaFornecedor),
    defaultValues: data?.data || initialPropsFornecedor
  });

  const watchFormaPagamento = useWatch({control: form.control, name: "id_forma_pagamento"});
  // setFormaPagamento(watchFormaPagamento);
  console.log(watchFormaPagamento);
  

  // function handleSelectionPlanoContas(item: ItemPlanoContas) {
  //   setValue('id_plano_contas', item.id)
  //   setValue("plano_contas", item.codigo + ' - ' + item.descricao)
  //   setModalPlanoContasOpen(false)
  // }
  // const watchIdFilial = watch('id_filial')
  // const watchDataEmissao = watch('data_emissao')
  // console.log("Data emissão -> ", typeof watchDataEmissao);


  const onSubmit = (data: fornecedorSchema) => {
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

                <div className="flex flex-wrap gap-3 items-center">
                  <FormInput className="w-64" name="cnpj" readOnly={!modalEditing} label="CPF/CNPJ" control={form.control} />
                  <FormInput className="w-[50ch] shrink-0" name="nome" readOnly={!modalEditing} label="Nome fantasia" control={form.control} />
                  <FormInput className="w-64" name="telefone" readOnly={!modalEditing} label="Telefone" control={form.control} />
                  <FormInput className="w-[30ch]" name="razao" readOnly={!modalEditing} label="Razão social" control={form.control} />
                  <FormInput className="w-[50ch]" name="email" readOnly={!modalEditing} label="Email" control={form.control} />
                  <FormInput name="cep" readOnly={!modalEditing} label="CEP" control={form.control} />
                  <FormInput className="w-[70ch]" name="logradouro" readOnly={!modalEditing} label="Logradouro" control={form.control} />
                  <FormInput className="w-[10ch]" name="numero" readOnly={!modalEditing} label="Número" control={form.control} />
                  <FormInput className="w-[50ch]" name="bairro" readOnly={!modalEditing} label="Bairro" control={form.control} />
                  <FormInput className="w-[50ch]" name="cidade" readOnly={!modalEditing} label="Cidade" control={form.control} />
                  <FormSelect
                    name="uf"
                    control={form.control}
                    label={"UF"}
                    options={[
                      { value: "1", label: "RN" },
                      { value: "2", label: "CE" },
                      { value: "3", label: "BA" },
                    ]}
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex gap-2 mb-3">
                <DollarSign /> <span className="text-lg font-bold ">Dados Bancários</span>
                </div>
                <div className="flex gap-3 flex-wrap items-center">
                    
                  <SelectFormaPagamento name="id_forma_pagamento" label="Forma de pagamento" control={form.control}/>
                  
                  {watchFormaPagamento === "4" && <SelectTipoChavePix name="id_tipo_chave_pix" label="Tipo de chave" control={form.control}/>}
                  <FormInput type={watchFormaPagamento !== "4"?"hidden":""} className="w-64" name="chave_pix" label="Chave PIX" control={form.control} />
                  <FormInput name="cnpj_favorecido" label="CPF/CNPJ Favorecido" control={form.control} />
                  <FormInput name="favorecido" label="Favorecido" control={form.control} />

                  <FormInput className="w-[20ch]" name="agencia" label="AG" control={form.control} />
                  <FormInput className="w-[10ch]" name="dv_agencia" label="DvAg" control={form.control} />
                  <FormSelect
                    name="tipo_conta"
                    control={form.control}
                    label={"Tipo de conta"}
                    className={"min-w-[20ch]"}
                    options={[
                      { value: "1", label: "CORRENTE" },
                      { value: "2", label: "POUPANÇA" },
                    ]}
                  />
                  <FormInput className="w-[20ch]" name="conta" label="Conta" control={form.control} />
                  <FormInput className="w-[10ch]" name="dv_conta" label="DvCt" control={form.control} />
                </div>
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
