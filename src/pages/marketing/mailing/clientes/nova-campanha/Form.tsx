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
import { useMailing } from "@/hooks/marketing/useMailing";
import { useEffect } from "react";
import { useStoreTableClientes } from "../table/store-table";
import { NovaCampanhaSchema, useFormNovaCampanhaData } from "./form-data";
import { useStoreNovaCampanha } from "./store";

type LoteProps = {
  nome: string;
  quantidade_itens: string;
};

function dividirClientesEmLotes(clientes: number, lotes: number) {
  const clientesPorLote = Math.floor(clientes / lotes);
  const lotesDistribuidos = [];
  for (let i = 0; i < lotes; i++) {
    if (i === lotes - 1) {
      // O último lote recebe o restante
      lotesDistribuidos.push({
        nome: `LOTE ${i + 1}`,
        quantidade_itens: String(clientesPorLote + (clientes % lotes)),
      });
    } else {
      lotesDistribuidos.push({
        nome: `LOTE ${i + 1}`,
        quantidade_itens: String(clientesPorLote),
      });
    }
  }
  return lotesDistribuidos || [];
}

const FormNovaCampanha = ({
  formRef,
}: {
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const {
    mutate: insertOneCampanha,
    isPending: insertOneCampanhaIsPending,
    isSuccess: insertOneCampanhaSuccess,
    isError: insertOneCampanhaIsError,
  } = useMailing().insertOneCampanha();

  const [closeModal, qtde_total, setIsPending] = useStoreNovaCampanha((state) => [
    state.closeModal,
    state.qtde_total,
    state.setIsPending,
  ]);
  const filters = useStoreTableClientes().filters;

  const { form } = useFormNovaCampanhaData({
    nome: "",
    quantidade_lotes: "4",
    quantidade_total_clientes: String(qtde_total || "0"),
    lotes: dividirClientesEmLotes(qtde_total || 0, 0),
  });
  const quantidade_lotes = parseFloat(form.watch("quantidade_lotes"));
  const quantidade_total_clientes = parseFloat(form.watch("quantidade_total_clientes"));

  useEffect(() => {
    form.setValue("lotes", dividirClientesEmLotes(quantidade_total_clientes, quantidade_lotes));
  }, [quantidade_total_clientes, quantidade_lotes]);

  const onSubmitData = (data: NovaCampanhaSchema) => {
    insertOneCampanha({ ...data, filters });
  };

  useEffect(() => {
    if (insertOneCampanhaIsPending) {
      setIsPending(true);
    }
    if (insertOneCampanhaSuccess) {
      closeModal();
      setIsPending(false);
    }
    if (insertOneCampanhaIsError) {
      setIsPending(false);
    }
  }, [insertOneCampanhaIsPending]);

  const formLotes = form.watch("lotes");

  // console.log(form.formState.errors);

  return (
    <div className="max-w-full overflow-x-hidden">
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
          <div className="max-w-full flex flex-col lg:flex-row gap-5">
            <div className="flex flex-1 flex-col gap-1 shrink-0">
              {/* Primeira coluna */}
              <section className="flex flex-col gap-3 p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex flex-wrap gap-3 ">
                  <FormInput
                    className="min-w-[30ch] flex-1"
                    name="nome"
                    label="Nome:"
                    placeholder="NOME DA NOVA CAMPANHA"
                    control={form.control}
                  />
                  <FormInput
                    className="min-w-[30ch] flex-1"
                    name="quantidade_lotes"
                    label="Quantidade de Lotes:"
                    control={form.control}
                    step="1"
                    type="number"
                    min={1}
                  />
                  <FormInput
                    type="number"
                    className="min-w-[30ch] flex-1"
                    name="quantidade_total_clientes"
                    readOnly
                    label="Quantidade Total de Clientes:"
                    control={form.control}
                    min={1}
                  />
                </div>
              </section>

              <Table
                className="rounded-md border-border w-full h-10 overflow-clip relative"
                divClassname="overflow-auto scroll-thin max-h-[40vh] border rounded-md mt-2"
              >
                <TableHeader className="bg-secondary">
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Quantidade de Itens</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formLotes.map((_, index) => (
                    <TableRow
                      key={`lote-${index}-campanha`}
                      className="uppercase odd:bg-secondary/60 even:bg-secondary/40"
                    >
                      <TableCell>
                        <FormInput
                          className="min-w-[30ch] flex-1"
                          name={`lotes.${index}.nome`}
                          control={form.control}
                        />
                      </TableCell>
                      <TableCell>
                        <FormInput
                          className="min-w-[30ch] flex-1"
                          name={`lotes.${index}.quantidade_itens`}
                          control={form.control}
                          type="number"
                          step="1"
                          min={1}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormNovaCampanha;
