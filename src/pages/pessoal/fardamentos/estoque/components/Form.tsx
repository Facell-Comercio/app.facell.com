import { Form } from "@/components/ui/form";
import { EstoqueFormdata, useFormEstoqueFardamentoData } from "./form-data";
import FormInput from "@/components/custom/FormInput";
import FormSelectGrupoEconomico from "@/components/custom/FormSelectGrupoEconomico";
import { useEffect } from "react";
import { Shirt } from "lucide-react";
import { useStoreEstoque } from "./Store";
import FormSelectModeloFardamento from "@/components/custom/FormSelectModeloFardamento";
import FormSelectTamanhoFardamento from "@/components/custom/FormSelectTamanhoFardamento";
import { useFardamentos } from "@/hooks/useFardamentos";
import { api } from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";
import FormSelectSexo from "@/components/custom/FormSelectSexo";
import { SelectUF } from "@/components/custom/SelectUF";

const FormEstoqueFardamento = ({
  data,
  formRef,
}: {
  data: EstoqueFormdata;
  formRef: React.MutableRefObject<null>;
}) => {
  const { form } = useFormEstoqueFardamentoData(data);
  const { mutate } = useFardamentos().abastecer();
  const id = useStoreEstoque().id;
  const saldo = form.watch("saldo", "0");
  const abastecer = form.watch("qtde", 0);
  useEffect(() => {
    const saldoFuturo = Number(saldo) + Number(abastecer);
    form.setValue("saldo_futuro", saldoFuturo.toString());
  }, [saldo, abastecer, form]);

  const onSubmit = (dadosForm: EstoqueFormdata) => {
    mutate(dadosForm);
    console.log(dadosForm);
  };

  const id_grupo_economico = form.watch("id_grupo_economico");
  const id_modelo = form.watch("id_modelo");
  const id_tamanho = form.watch("id_tamanho");
  const uf = form.watch("uf");
  const sexo = form.watch("sexo");
  let  alterado= form.watch("alterado");
  


  useEffect(() => {
    if (id_grupo_economico && id_modelo && id_tamanho && uf && sexo && !id) {
      getOneByParams();
    }
  }, [id_grupo_economico, id_modelo, id_tamanho, uf, sexo]);

  const { errors } = form.formState;
  console.log(errors);

  async function getOneByParams() {
    try {
      const result =
        await api.get(`/pessoal/fardamentos/estoque/by-params?id_grupo_economico=${id_grupo_economico}
      &id_modelo=${id_modelo}&id_tamanho=${id_tamanho}&uf=${uf}&sexo=${sexo}`);
      form.setValue("id", result.data.id || null);
      form.setValue("saldo", result.data.saldo ? `${result.data.saldo}` : "0");
      form.setValue("alterado",  result.data.id ? true : false);
    } catch (error) {
      toast({
        title: "Ocorreu um erro",
        variant: "destructive",
        //@ts-ignore
        description: error?.response?.data?.message || error.message,
      });
    }
  }

  return (
    <div className="max-w-full overflow-x-hidden">
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-w-full flex flex-col lg:flex-row gap-5">
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Shirt />
                    <span className="text-lg font-bold ">
                      {alterado ? "Abastecer Fardamento" : "Novo Fardamento"  }
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 items-end mb-1">
                  <FormSelectGrupoEconomico
                    name="id_grupo_economico"
                    label="Grupo econômico"
                    disabled={!!id}
                    control={form.control}
                  />
                  <FormSelectModeloFardamento
                    name="id_modelo"
                    label="Modelo"
                    disabled={!!id}
                    control={form.control}
                  />
                  <FormSelectTamanhoFardamento
                    name="id_tamanho"
                    label="Tamanho"
                    disabled={!!id}
                    control={form.control}
                  />

                  <SelectUF
                    name="uf"
                    label="UF"
                    disabled={!!id}
                    control={form.control}
                  />
                  <FormSelectSexo
                    className="flex-min-w-[40ch] shrink-0"
                    name="sexo"
                    label="Sexo"
                    disabled={!!id}
                    control={form.control}
                  />
                </div>
                <div className="flex flex-wrap gap-2 items-end mb-1">
                  <FormInput
                    className="flex-1-min-w-[40ch] shrink-0"
                    name="saldo"
                    label="Saldo"
                    disabled={true}
                    control={form.control}
                    // disabled={disabled}
                    // readOnly={readOnly}
                  />
                  <FormInput
                    className="flex-1-min-w-[40ch] shrink-0"
                    name="qtde"
                    label="Abastecer"
                    control={form.control}
                  />
                  <FormInput
                    name="saldo_futuro"
                    label="Saldo futuro"
                    control={form.control}
                    disabled={true}
                  />
                  
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormEstoqueFardamento;
