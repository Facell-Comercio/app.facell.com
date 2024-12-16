import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { Input } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { useConferenciasCaixa } from "@/hooks/financeiro/useConferenciasCaixa";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Ban, Save } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { TbCurrencyReal } from "react-icons/tb";
import { useStoreCaixa } from "../store";

export type NewBoletoProps = {
  id_filial?: string;
  valor?: string;
};

type CaixaProps = {
  id?: string;
  data?: string;
  saldo?: string;
  saldo_no_boleto?: string;
  saldo_final?: string;
  status?: string;
};

const initialPropsBoleto: NewBoletoProps = {
  id_filial: "",
  valor: "0",
};

const ModalNewBoleto = () => {
  const [modalOpen, closeModal, id_filial, filial, setIsPending, isPending] = useStoreCaixa(
    (state) => [
      state.modalBoletoOpen,
      state.closeModalBoleto,
      state.id_filial,
      state.filial,
      state.setIsPending,
      state.isPending,
    ]
  );
  const [formData, setFormData] = useState<NewBoletoProps>(initialPropsBoleto);
  const formRef = useRef<HTMLFormElement | null>(null);

  const { data } = useConferenciasCaixa().getAllCaixasComSaldo(id_filial);
  const rows = data?.rows;

  const {
    mutate: insertOne,
    isSuccess: insertOneIsSuccess,
    isPending: insertOneIsPending,
    isError: insertOneIsError,
  } = useConferenciasCaixa().insertOneBoleto();

  function onSubmitData() {
    if (!formData.id_filial) {
      toast({ title: "Por algum motivo não há um id_filial", variant: "warning" });
      return;
    }
    insertOne(formData);
  }

  useEffect(() => {
    if (insertOneIsPending) {
      setIsPending(true);
    }
    if (insertOneIsSuccess) {
      closeModal();
      setIsPending(false);
    }
    if (insertOneIsError) {
      setIsPending(false);
    }
  }, [insertOneIsPending]);

  useEffect(() => {
    !modalOpen && setFormData({ ...initialPropsBoleto, id_filial: id_filial || "" });
    modalOpen &&
      setFormData({ valor: String(parseInt(data?.total_disponivel)), id_filial: id_filial || "" });
  }, [modalOpen]);

  function handleClickCancel() {
    closeModal();
  }

  function StatusCaixa({ status }: { status: string }) {
    if (status === "a_liquidar") {
      return <p className="font-semibold text-green-500">A Liquidar</p>;
    }
    if (status === "a_abater") {
      return <p className="font-semibold text-yellow-500">A abater</p>;
    }
    if (status === "pendente") {
      return <p>-</p>;
    }
  }

  const caixas = useMemo(() => {
    let valor = parseFloat(formData.valor || "0"); //* Valor total a ser debitado
    return rows?.map((row: CaixaProps) => {
      let rowSaldo = parseFloat(row.saldo || "0"); //* Saldo do caixa atual

      let saldo_no_boleto = 0;
      let status = "pendente";

      //* Se ainda houver valor para debitar
      if (valor > 0) {
        if (parseFloat(valor.toFixed(2)) >= rowSaldo) {
          //* Se o valor a ser debitado for maior ou igual ao saldo da caixa
          saldo_no_boleto = rowSaldo; //* Debita todo o saldo do caixa
          valor -= rowSaldo; //* Subtrai o saldo do caixa do valor total
          rowSaldo = 0; //* O saldo final do caixa fica 0
          status = "a_liquidar"; //* O caixa é marcado como a pagar
        } else {
          //* Se o valor a ser debitado for menor que o saldo do caixa
          saldo_no_boleto = valor; //* Debita o valor parcial do caixa
          rowSaldo -= valor; //* Subtrai o valor parcial do saldo do caixa
          valor = 0; //* Todo o valor foi debitado, zera o valor
          status = "a_abater"; //* O caixa é marcado como pagar parcialmente
        }
      }

      //* Retorna o objeto com os valores ajustados
      return {
        id: row.id,
        data: row.data,
        saldo: row.saldo, //* O saldo original
        saldo_no_boleto: saldo_no_boleto, //* Quanto foi debitado desse caixa
        saldo_final: rowSaldo, //* O saldo que sobrou no caixa
        status,
      };
    });
  }, [formData.valor, rows]);

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Novo Boleto</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && (
            <form
              className="flex gap-2 flex-wrap p-1"
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSubmitData();
              }}
            >
              <div className="flex flex-col gap-2 flex-1">
                <label className="font-medium text-sm">Filial</label>
                <Input readOnly value={filial || ""} />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="font-medium text-sm">Total Disponível</label>
                <span className="flex">
                  <Button variant={"secondary"} className="rounded-none rounded-l-md">
                    <TbCurrencyReal size={18} />
                  </Button>
                  <Input
                    readOnly
                    value={data?.total_disponivel || ""}
                    type="number"
                    className="rounded-none rounded-r-md"
                  />
                </span>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="font-medium text-sm">Valor do Boleto</label>
                <span className="flex">
                  <Button variant={"secondary"} className="rounded-none rounded-l-md">
                    <TbCurrencyReal size={18} />
                  </Button>
                  <Input
                    value={formData.valor || ""}
                    type="number"
                    className="rounded-none rounded-r-md"
                    onChange={(e) => setFormData((prev) => ({ ...prev, valor: e.target.value }))}
                    min={0}
                    max={data?.total_disponivel}
                  />
                </span>
              </div>
              <Table
                className="rounded-md border-border w-full h-10 overflow-clip relative"
                divClassname="overflow-auto scroll-thin max-h-[40vh] border rounded-md mt-2"
              >
                <TableHeader className="sticky w-full top-0 h-10 border-b-2 border-border rounded-t-md bg-secondary">
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Valor no Boleto</TableHead>
                    <TableHead>Saldo Final</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {caixas.map((row: any) => (
                    <TableRow
                      key={`novo-boleto-caixa:${row.id}`}
                      className="uppercase odd:bg-secondary/60 even:bg-secondary/40"
                    >
                      <TableCell>
                        <StatusCaixa status={row.status} />
                      </TableCell>
                      <TableCell>{normalizeDate(row.data)}</TableCell>
                      <TableCell>{normalizeCurrency(row.saldo)}</TableCell>
                      <TableCell>{normalizeCurrency(row.saldo_no_boleto)}</TableCell>
                      <TableCell>{normalizeCurrency(row.saldo_final)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </form>
          )}
          <ScrollBar />
        </ScrollArea>
        <DialogFooter>
          <Button
            type={"button"}
            size="lg"
            variant={"secondary"}
            disabled={isPending}
            onClick={handleClickCancel}
          >
            <Ban className="me-2 text-xl" />
            Cancelar
          </Button>
          <AlertPopUp
            title="Deseja realmente prosseguir?"
            description="Um boleto será criado e será enviado por email para cada receptor da loja."
            action={() => {
              formRef.current && formRef.current.requestSubmit();
            }}
          >
            <Button type={"submit"} size="lg" className="dark:text-white" disabled={isPending}>
              <Save className="me-2" />
              Salvar
            </Button>
          </AlertPopUp>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalNewBoleto;
