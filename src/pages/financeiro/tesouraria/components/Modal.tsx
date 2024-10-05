import { DataTable } from "@/components/custom/DataTable";
import { Input } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { useTesouraria } from "@/hooks/financeiro/useTesouraria";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Calendar, CircleMinus, CirclePlus } from "lucide-react";
import ModalTitulosAPagar, { TituloPagarProps } from "../../components/ModalTitulosAPagar";
import { useStoreTesouraria } from "../store";
import { columnsTableMovimentacao } from "./columns-movimentacao";
import FiltersMovimentacaoTesouraria from "./FiltersMovimentacaoTesouraria";
import ModalAdiantamento from "./ModalAdiantamento";
import ModalFechamento from "./ModalFechamento";
import ModalSuprimento from "./ModalSuprimento";

const ModalTesouraria = () => {
  const [
    modalOpen,
    closeModal,
    id,
    id_extrato_bancario,
    valor_maximo_adiantamento,
    openModalAdiantamento,
    openModalSuprimento,
    openModalFechamento,

    modalTitulosPagarOpen,
    closeTitulosPagarModal,

    pagination,
    setPagination,
    filters,
  ] = useStoreTesouraria((state) => [
    state.modalOpen,
    state.closeModal,
    state.id,
    state.id_extrato_bancario,
    state.valor_maximo_adiantamento,
    state.openModalAdiantamento,
    state.openModalSuprimento,
    state.openModalFechamento,

    state.modalTitulosPagarOpen,
    state.closeTitulosPagarModal,

    state.pagination,
    state.setPagination,
    state.filters,
  ]);

  const { data, refetch } = useTesouraria().getOne({ id, pagination, filters });

  const { mutate: vincularAdiantamento } = useTesouraria().vincularAdiantamento();

  function handleClickCancel() {
    closeModal();
  }

  function handleSelection(titulo: TituloPagarProps) {
    vincularAdiantamento({
      id_titulo: titulo.id || "",
      id_extrato_bancario: id_extrato_bancario || "",
    });
  }

  const rows = data?.movimentacao_caixa || [];
  const rowCount = data?.movimentacao_caixa_qtde || 0;
  const data_fechamento = data?.data_fechamento;
  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent className="min-w-[96vw] xl:min-w-1">
        <DialogHeader>
          <DialogTitle className="flex justify-between pe-4">Conta: {id}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <section className="flex flex-col gap-3 w-full">
            <div className="flex w-full gap-3">
              <span className="flex flex-1 flex-col gap-2">
                <label className="text-sm font-medium">Conta:</label>
                <Input value={data?.conta} readOnly />
              </span>
              <span className="flex flex-1 flex-col gap-2">
                <label className="text-sm font-medium">Saldo:</label>
                <Input value={normalizeCurrency(data?.saldo)} readOnly />
              </span>
              <span className="flex flex-1 flex-col gap-2">
                <label className="text-sm font-medium">Último Fechamento:</label>
                <Input value={normalizeDate(data_fechamento) || ""} readOnly />
              </span>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant={"warning"}
                onClick={() => openModalFechamento(new Date(data_fechamento))}
              >
                <Calendar size={18} className="me-2" />
                Realizar Fechamento
              </Button>
              <Button variant={"success"} onClick={() => openModalSuprimento("")}>
                <CirclePlus size={18} className="me-2" />
                Lançar Suprimento
              </Button>
              <Button variant={"destructive"} onClick={() => openModalAdiantamento("")}>
                <CircleMinus size={18} className="me-2" />
                Lançar Adiantamento
              </Button>
            </div>
            <FiltersMovimentacaoTesouraria refetch={refetch} />
            <div className="bg-secondary/40 rounded-md">
              <DataTable
                pagination={pagination}
                setPagination={setPagination}
                data={rows}
                rowCount={rowCount}
                columns={columnsTableMovimentacao}
              />
            </div>
          </section>
          <ModalTitulosAPagar
            open={modalTitulosPagarOpen}
            handleSelection={handleSelection}
            onOpenChange={closeTitulosPagarModal}
            alert_title="Deseja realmente vincular esse título?"
            alert_description="A ação não poderá ser desfeita, e esse título ficará vinculado ao adiantamento"
            initialFilters={{
              forma_pagamento_list: ["3"],
              status_list: ["3", "1"],
              id_matriz: data?.id_matriz,
              valor_maximo: valor_maximo_adiantamento,
            }}
          />
          <ModalFechamento />
          <ModalAdiantamento />
          <ModalSuprimento />
          <ScrollBar />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ModalTesouraria;
