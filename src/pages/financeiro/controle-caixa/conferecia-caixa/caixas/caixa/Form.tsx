import AlertPopUp from "@/components/custom/AlertPopUp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import {
  ConferenciasCaixaSchema,
  useConferenciasCaixa,
} from "@/hooks/financeiro/useConferenciasCaixa";
import { Landmark, List, Pencil, Plus, Trash } from "lucide-react";
import CaixaCards from "./components/CaixaCards";
import { ItemAccordionCaixa } from "./components/ItemAccordionCaixa";
import StatusCaixa from "./components/StatusCaixa";
import ModalDeposito from "./depositos/ModalDeposito";
import { useFormCaixaData } from "./form-data";
import ModalOcorrencias from "./ocorrencias/ModalOcorrencias";
import RowVirtualizedFixedMovimentoCaixa from "./RowVirtualizedMovimentoCaixa";
import { useStoreCaixa } from "./store";

const FormCaixa = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: ConferenciasCaixaSchema;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const movimentos_caixa = data.movimentos_caixa || [];
  const qtde_movimentos_caixa = parseInt(data.qtde_movimentos_caixa || "0");
  const depositos_caixa = data.depositos_caixa || [];
  const qtde_depositos_caixa = parseInt(data.qtde_depositos_caixa || "0");

  const [
    closeModal,
    openModalOcorrencias,
    openModalDeposito,
    modalDepositoEditing,
    editModalDeposito,
  ] = useStoreCaixa((state) => [
    state.closeModal,
    state.openModalOcorrencias,
    state.openModalDeposito,
    state.modalDepositoEditing,
    state.editModalDeposito,
  ]);

  const { form } = useFormCaixaData(data);
  const { mutate: deleteDeposito } = useConferenciasCaixa().deleteDeposito();

  const onSubmitData = (data: ConferenciasCaixaSchema) => {
    // if (id) update(data);
    // if (!id) insertOne(data);
    // console.log(data);
  };

  // ! Verificar a existênicia de erros
  // console.log(form.formState.errors);

  function handleClickNewDeposito() {
    openModalDeposito("");
    editModalDeposito(true);
  }

  return (
    <div className="max-w-full overflow-x-hidden">
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmitData)}
          className="gap-3 max-w-screen-xl w-full grid grid-cols-1 z-[100]"
        >
          <div className="overflow-auto scroll-thin z-[100] flex flex-col gap-3 max-w-full h-full max-h-[72vh] sm:max-h-[70vh] col-span-2">
            {/* Primeira coluna */}
            <StatusCaixa data={data} />
            <CaixaCards data={data} />
            <ItemAccordionCaixa
              icon={List}
              value={"movimento-caixa"}
              qtde={qtde_movimentos_caixa}
              title="Movimento de Caixa"
            >
              <RowVirtualizedFixedMovimentoCaixa data={movimentos_caixa} />
            </ItemAccordionCaixa>
            <ItemAccordionCaixa
              icon={Landmark}
              value={"depositos-caixa"}
              qtde={qtde_depositos_caixa}
              title="Depósitos"
              className="flex flex-col items-end"
            >
              <div className="flex justify-between w-full">
                <span className="flex gap-2 items-center justify-center">
                  <Badge variant="info">
                    {`Saldo anterior: ${normalizeCurrency(
                      data.saldo_anterior
                    )}`}
                  </Badge>
                  <Badge variant="info">
                    {`Saldo: ${normalizeCurrency(data.saldo_atual)}`}
                  </Badge>
                </span>
                <Button className="flex gap-2" onClick={handleClickNewDeposito}>
                  <Plus />
                  Novo Depósito
                </Button>
              </div>
              <Table className="bg-background rounded-md">
                <TableHeader>
                  <TableRow>
                    <TableHead>Ações</TableHead>
                    <TableHead>Conta Bancária</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Comprovante</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {depositos_caixa.map((deposito, index) => (
                    <TableRow key={`deposito ${deposito.id} ${index}`}>
                      <TableCell className="flex gap-2">
                        <Button
                          variant={"warning"}
                          size={"xs"}
                          className="min-w-10"
                          onClick={() => {
                            openModalDeposito(deposito.id || "");
                          }}
                        >
                          <Pencil size={14} />
                        </Button>
                        <AlertPopUp
                          title={"Deseja realmente excluir"}
                          description="Essa ação não pode ser desfeita. O depósito será excluído definitivamente do servidor."
                          action={() => {
                            deleteDeposito(deposito.id || "");
                          }}
                        >
                          <Button
                            variant={"destructive"}
                            size={"xs"}
                            className="min-w-10"
                          >
                            <Trash size={14} />
                          </Button>
                        </AlertPopUp>
                      </TableCell>
                      <TableCell>{deposito.conta_bancaria}</TableCell>
                      <TableCell>{normalizeCurrency(deposito.valor)}</TableCell>
                      <TableCell>{deposito.comprovante}</TableCell>
                      <TableCell>
                        {normalizeDate(deposito.data_deposito || "")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ItemAccordionCaixa>
          </div>
        </form>
      </Form>
      <ModalDeposito id_matriz={data.id_matriz} />
      <ModalOcorrencias />
    </div>
  );
};

export default FormCaixa;
