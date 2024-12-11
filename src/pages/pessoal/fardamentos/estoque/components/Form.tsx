import { Form } from "@/components/ui/form"
import { EstoqueFormdata, useFormEstoqueFardamentoData } from "./form-data"
import FormInput from "@/components/custom/FormInput";
import { id } from "date-fns/locale";
import FormSelectGrupoEconomico from "@/components/custom/FormSelectGrupoEconomico";
import { watch } from "fs";
import { useEffect } from "react";

const FormEstoqueFardamento = ({data}: {data: EstoqueFormdata}) => {
  console.log(data);
  const { form } = useFormEstoqueFardamentoData(data);
  
  
  const saldo = watch("saldo", "0")
  const abastecer = watch("abastecer", "0");
  useEffect(() => {
    const saldoFuturo = Number(saldo) + Number(abastecer);
    form.setValue("saldo_futuro", saldoFuturo.toString());
  },[saldo, abastecer, form]);


  return (
    <div className="max-w-full overflow-x-hidden">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => {})}>
          <div className="max-w-full flex flex-col lg:flex-row gap-5">
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div>
                  <FormSelectGrupoEconomico
                  name="id_grupo_economico"
                  label="Grupo econômico"
                  disabled={!!id}
                  control={form.control}
                  />
                  <FormInput
                    className="flex-1-min-w-[40ch] shrink-0"
                    name="uf"
                    label="UF"
                    disabled={!!id}
                    control={form.control}
                  />
                </div>
                <FormInput
                  className="flex-1-min-w-[40ch] shrink-0"
                  name="modelo"
                  label="Modelo"
                  control={form.control}
                  disabled={!!id}
                />
                <FormInput
                  className="flex-1-min-w-[40ch] shrink-0"
                  name="tamanho"
                  label="Tamanho"
                  disabled={!!id}
                  control={form.control}
                />
                <FormInput
                  className="flex-1-min-w-[40ch] shrink-0"
                  name="sexo"
                  label="Sexo"
                  disabled={!!id}
                  control={form.control}
                />
                <FormInput
                  className="flex-1-min-w-[40ch] shrink-0"
                  name="saldo"
                  label="Saldo"
                  disabled={!!id}
                  control={form.control}
                  // disabled={disabled}
                  // readOnly={readOnly}
                />
                <FormInput
                  className="flex-1-min-w-[40ch] shrink-0"
                  name="abastecer"
                  label="Abastecer"
                  control={form.control}
                />
                <FormInput
                name="saldo_futuro"
                label="Saldo futuro"
                control={form.control}
                disabled={true}/>
                
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormEstoqueFardamento;