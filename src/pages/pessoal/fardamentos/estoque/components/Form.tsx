import { Form } from "@/components/ui/form"
import { useFormEstoqueFardamentoData } from "./form-data"
import FormInput from "@/components/custom/FormInput";
import { useFardamentos } from "@/hooks/useFardamentos";
const FormEstoqueFardamento = ()=>{

  const { data } = useFardamentos().getOne(1)
    console.log(data);
    const { form } = useFormEstoqueFardamentoData(data);
    
    
    return (
        <div className="max-w-full overflow-x-hidden">
            <Form {...form}>
        <form onSubmit={form.handleSubmit(()=>{})}>
          <div className="max-w-full flex flex-col lg:flex-row gap-5">
            {/* Primeira coluna */}
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">

                  <div>
                    <FormInput
                      className="flex-1 min-w-[40ch] shrink-0"
                      name="grupo_economico"
                      // readOnly={!modalEditing || isPending}
                      label="Grupo Econômico"
                      control={form.control}
                    />
                    <FormInput
                    className="flex-1-min-w-[40ch] shrink-0"
                    name="uf"
                    label="UF"
                    control={form.control}
                    />
                  </div>
                  <FormInput
                  className="flex-1-min-w-[40ch] shrink-0"
                  name="modelo"
                  label="Modelo"
                  control={form.control}/>
                  <FormInput
                  className="flex-1-min-w-[40ch] shrink-0"
                  name="tamanho"
                  label="Tamanho"
                  control={form.control}
                  />
                  <FormInput
                  className="flex-1-min-w-[40ch] shrink-0"
                  name="sexo"
                  label="Sexo"
                  control={form.control}/>
                  <FormInput
                  className="flex-1-min-w-[40ch] shrink-0"
                  name="saldo"
                  label="Saldo"
                  control={form.control}
                  // disabled={disabled}
                  // readOnly={readOnly}
                  />
                  <FormInput
                  className="flex-1-min-w-[40ch] shrink-0"
                  name="abastecer"
                  label="Abastecer"
                  control={form.control}/>

                </div>
              </div>
          </div>
        </form>
      </Form>
        </div>
    )
                }

export default FormEstoqueFardamento;