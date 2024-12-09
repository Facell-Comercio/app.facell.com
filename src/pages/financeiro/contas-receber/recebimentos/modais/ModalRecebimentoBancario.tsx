import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/custom/FormInput";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { normalizeCurrency, normalizeDate, normalizeNumberFixed } from "@/helpers/mask";
import { useTituloReceber } from "@/hooks/financeiro/useTituloReceber";
import ModalContasBancarias, {
  ItemContaBancariaProps,
} from "@/pages/financeiro/components/ModalContasBancarias";
import { VencimentoCRProps } from "@/pages/financeiro/components/ModalVencimentosCR";
import { Ban, FastForward, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { useStoreRecebimentos } from "../store";
import FiltersTransacoes from "./components/FiltersTransacoes";
import FiltersVencimentos from "./components/FiltersVencimentos";
import VirtualizedTransacoesCR, {
  TransacoesRecebimentoBancario,
} from "./components/VirtualizedTransacoesCR";
import VirtualizedVencimentosCR from "./components/VirtualizedVencimentosCR";
import { useStoreTableModalRecebimentos } from "./store-table";

export type FilterRecebimentosBancariosProps = {
  data_transacao?: string;
  id_extrato?: string;
};

export function ModalRecebimentoBancario() {
  const [modalOpen, closeModal, editIsPending, isPending] = useStoreRecebimentos((state) => [
    state.modalRecebimentoBancarioOpen,
    state.closeModalRecebimentoBancario,

    state.editIsPending,
    state.isPending,
  ]);

  const {
    mutate: insertOne,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
    isError: insertIsError,
  } = useTituloReceber().insertOneRecebimentoContaBancaria();

  const [modalContasBancariasOpen, setModalContasBancariasOpen] = useState(false);
  const [filters, setFilters] = useState<FilterRecebimentosBancariosProps>({
    data_transacao: undefined,
    id_extrato: undefined,
  });
  const [filters_extratos_bancarios, filters_vencimentos, contaBancaria, setContaBancaria] =
    useStoreTableModalRecebimentos((state) => [
      state.filters_extratos_bancarios,
      state.filters_vencimentos,
      state.conta_bancaria,
      state.setContaBancaria,
    ]);

  const [id_vencimento, id_matriz] = useStoreRecebimentos((state) => [
    state.id_vencimento,
    state.id_matriz,
  ]);

  const { data, refetch } = useTituloReceber().getAllTransacoesAndVencimentos({
    id_conta_bancaria: contaBancaria?.id,
    id_matriz: contaBancaria?.id_matriz,
    filters_extratos_bancarios,
    filters_vencimentos: {
      ...filters_vencimentos,
      id_vencimento,
    },
  });

  const transacoes = data?.transacoes || [];
  const filteredTransacoes = useMemo<TransacoesRecebimentoBancario[]>(
    () =>
      transacoes.filter((transacao: TransacoesRecebimentoBancario) => {
        if (filters.data_transacao === undefined) {
          return transacao;
        }
        return normalizeDate(transacao.data_transacao) === normalizeDate(filters.data_transacao);
      }),
    [data, filters]
  );
  const totalTransacoes = filteredTransacoes.reduce(
    (acc, transacao) => acc + parseFloat(transacao.valor_em_aberto || "0"),
    0
  );
  const totalPagoTransacoes = parseFloat(
    filteredTransacoes.filter((transacao) => transacao.id === filters.id_extrato)[0]
      ?.valor_em_aberto || "0"
  );

  const vencimentos = data?.vencimentos || [];
  const filteredVencimentos = useMemo<VencimentoCRProps[]>(
    () =>
      vencimentos.filter((vencimento: VencimentoCRProps) => {
        if (filters.data_transacao === undefined) {
          return vencimento;
        }
        return normalizeDate(vencimento.data_vencimento) === normalizeDate(filters.data_transacao);
      }),
    [data, filters]
  );
  const totalVencimentos = filteredVencimentos.reduce(
    (acc, vencimento) => acc + parseFloat(vencimento?.valor || "0"),
    0
  );

  const [rowVencimentos, setRowVenciementos] = useState<VencimentoCRProps[]>([]);
  useEffect(() => setRowVenciementos(filteredVencimentos), [filteredVencimentos]);

  const totalReceberVencimentos = rowVencimentos.reduce(
    (acc, vencimento) => acc + parseFloat(vencimento?.valor_pagar || "0"),
    0
  );
  const valorRestante = totalPagoTransacoes - totalReceberVencimentos;

  function handleClickCancel() {
    closeModal();
  }

  function handleSelectionContaBancaria(item: ItemContaBancariaProps) {
    setContaBancaria(item);
    setModalContasBancariasOpen(false);
  }

  useEffect(() => {
    setContaBancaria(null);
  }, [modalOpen]);

  useEffect(() => {
    if (insertIsSuccess) {
      setFilters({
        data_transacao: undefined,
        id_extrato: undefined,
      });
      editIsPending(false);
    } else if (insertIsError) {
      editIsPending(false);
    } else if (insertIsPending) {
      editIsPending(true);
    }
  }, [insertIsPending]);

  function onSubmit() {
    const vencimentos = rowVencimentos.filter(
      (vencimento) => parseFloat(vencimento.valor_pagar || "0") > 0
    );
    if (!filters.id_extrato) {
      toast({ title: "Selecione uma transação", variant: "warning" });
      return;
    }
    if (vencimentos.length < 1) {
      toast({ title: "Nenhum vencimento selecionado", variant: "warning" });
      return;
    }
    const valorDiferenca = Math.abs(totalPagoTransacoes - totalReceberVencimentos);

    if (totalPagoTransacoes < totalReceberVencimentos) {
      toast({
        title: "Valor acima do necessário!",
        description: `O valor pago dos vencimentos ultrapassaram em ${normalizeCurrency(
          valorDiferenca
        )} o valor da transação bancária!`,
        variant: "warning",
      });
      return;
    }

    insertOne({
      id_extrato: filters.id_extrato,
      id_conta_bancaria: contaBancaria?.id || "",
      vencimentos,
    });
  }

  function preencherAutomaticamente() {
    let valorPagar = totalPagoTransacoes;

    setRowVenciementos(
      rowVencimentos.map((vencimento) => {
        const valorVencimento = normalizeNumberFixed(vencimento.valor || 0, 2);
        if (valorPagar === 0) {
          return vencimento;
        }
        if (valorPagar > valorVencimento) {
          valorPagar -= valorVencimento;

          return { ...vencimento, valor_pagar: String(valorVencimento) };
        }
        if (valorPagar <= valorVencimento) {
          const obj = { ...vencimento, valor_pagar: String(valorPagar) };
          valorPagar = 0;
          return obj;
        }

        return vencimento;
      })
    );
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent className={`md:max-w-7xl`}>
        <DialogHeader>
          <DialogTitle>Adicionar Recebimento</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <section className="flex gap-3 flex-wrap p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
          <div className="flex-1 min-w-[30ch] flex flex-col gap-2">
            <label className="text-sm font-medium">Conta Bancaria</label>
            <Input
              readOnly
              placeholder="SELECIONE A CONTA BANCÁRIA"
              value={contaBancaria?.descricao}
              onClick={() => setModalContasBancariasOpen(true)}
              disabled={isPending}
            />
          </div>
          {contaBancaria && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex justify-end col-span-1 md:col-span-2">
                <Button
                  variant={"tertiary"}
                  disabled={!filters.id_extrato}
                  title={!filters.id_extrato ? "Selecione uma transação" : ""}
                  onClick={preencherAutomaticamente}
                >
                  <FastForward size={18} className="me-2" />
                  Preencher Automaticamente
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <FiltersTransacoes refetch={refetch} />
                <p className="text-sm font-medium">Transações Bancárias</p>
                <VirtualizedTransacoesCR
                  data={filteredTransacoes}
                  setFilters={setFilters}
                  filters={filters}
                />
                <span className="flex gap-2 justify-between">
                  <Badge variant={"info"}>Total: {normalizeCurrency(totalTransacoes)}</Badge>
                  <Badge variant={"info"}>Pagando: {normalizeCurrency(totalPagoTransacoes)}</Badge>
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <FiltersVencimentos refetch={refetch} />

                <p className="text-sm font-medium">Vencimentos</p>
                <VirtualizedVencimentosCR
                  data={rowVencimentos}
                  setData={setRowVenciementos}
                  filters={filters}
                />
                <span className="flex gap-2 justify-between">
                  <Badge variant={"info"}>Total: {normalizeCurrency(totalVencimentos)}</Badge>
                  <span className="flex gap-2">
                    <Badge
                      variant={valorRestante < 0 ? "destructive" : "info"}
                      title={valorRestante < 0 ? "Atenção! Valor acima do permitido" : ""}
                    >
                      Restam:
                      {normalizeCurrency(valorRestante)}
                    </Badge>
                    <Badge variant={"info"}>
                      Recebendo: {normalizeCurrency(totalReceberVencimentos)}
                    </Badge>
                  </span>
                </span>
              </div>
            </div>
          )}
        </section>
        <ModalContasBancarias
          open={modalContasBancariasOpen}
          handleSelection={handleSelectionContaBancaria}
          onOpenChange={() => setModalContasBancariasOpen(false)}
          isCaixa={false}
          id_matriz={id_matriz}
        />
        <DialogFooter>
          <Button
            className="flex gap-2"
            variant={"secondary"}
            onClick={handleClickCancel}
            disabled={isPending}
          >
            <Ban size={18} />
            Cancelar
          </Button>
          <Button className="flex gap-2" onClick={onSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <FaSpinner size={18} className="me-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={18} />
                Salvar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
