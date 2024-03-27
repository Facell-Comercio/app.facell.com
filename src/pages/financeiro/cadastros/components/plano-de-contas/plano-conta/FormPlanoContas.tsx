import FormInput from "@/components/custom/FormInput";
import FormSelect from "@/components/custom/FormSelect";
import FormSelectGrupoEconomico from "@/components/custom/FormSelectGrupoEconomico";
import FormSwitch from "@/components/custom/FormSwitch";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { normalizeCnpjNumber, normalizePhoneNumber } from "@/helpers/mask";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fingerprint, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlanoContasSchema } from "./ModalPlanoContas";
import { useStorePlanoContas } from "./store-plano-contas";

const schemaPlanoContas = z
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

const FormPlanoContas = ({ id,data  }: { id: string | null | undefined, data:PlanoContasSchema }) => {
  console.log('RENDER - PlanoContas:', id)
  const modalEditing = useStorePlanoContas().modalEditing
  
  const initialPropsPlanoContas: PlanoContasSchema = {
    // Dados PlanoContas
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

  const form = useForm<PlanoContasSchema>({
    resolver: zodResolver(schemaPlanoContas),
    defaultValues: data||initialPropsPlanoContas,
    values: data
  });
  
  // setFormaPagamento(watchFormaPagamento);  

  // function handleSelectionPlanoContas(item: ItemPlanoContas) {
  //   setValue('id_plano_contas', item.id)
  //   setValue("plano_contas", item.codigo + ' - ' + item.descricao)
  //   setModalPlanoContasOpen(false)
  // }
  // const watchIdFilial = watch('id_filial')
  // const watchDataEmissao = watch('data_emissao')
  // console.log("Data emissão -> ", typeof watchDataEmissao);


  const onSubmit = (data: PlanoContasSchema) => {
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
    <div className="max-w-full max-h-[90vh] overflow-x-hidden">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-w-full flex flex-col lg:flex-row gap-5">
            {/* Primeira coluna */}
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex gap-2">
                    <Fingerprint /> <span className="text-lg font-bold ">Identificação do Plano Contas</span>
                  </div> 
                  <FormSwitch name="ativo" disabled={!modalEditing} label="Ativo" control={form.control}/>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                  <FormInput className="flex-1 min-w-40" name="codigo" readOnly={!modalEditing} label="Código" control={form.control} />
                  <FormInput className="flex-1 min-w-[40ch]" name="descricao" readOnly={!modalEditing} label="Descrição" control={form.control} />
                  <FormInput className="flex-1 min-w-40" name="codigo_pai" readOnly={!modalEditing} label="Código Pai" control={form.control} />
                  <FormInput className="flex-1 min-w-[40ch]" readOnly={!modalEditing} name="descricao_pai" label="Descrição Pai" control={form.control} />
                </div>
              </div>

              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex gap-2 mb-3">
                <Info /> <span className="text-lg font-bold ">Parâmetros</span>
                </div>
                <div className="flex gap-3 flex-wrap items-center">
                  <FormInput className="flex-1 min-w-32" readOnly={!modalEditing} name="nivel" label="Nível de Controle" control={form.control} />
                  <FormSelect
                    name="tipo"
                    disabled={!modalEditing}
                    control={form.control}
                    label={"Tipo"}
                    className={"flex-1 min-w-[20ch]"}
                    options={[
                      { value: "RECEITA", label: "RECEITA" },
                      { value: "DESPESA", label: "DESPESA" },
                    ]}
                  />
                  <FormSelectGrupoEconomico className="min-w-32" name="id_grupo_economico" disabled={!modalEditing} label="Grupo Econômico" control={form.control}/>
                  <FormInput className="flex-1 min-w-44" readOnly={!modalEditing} name="codigo_contra_estorno" label="Código Contra Estorno" control={form.control} />
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormPlanoContas;
