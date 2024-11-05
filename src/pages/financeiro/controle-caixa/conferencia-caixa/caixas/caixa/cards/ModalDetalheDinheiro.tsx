import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { useConferenciasCaixa } from "@/hooks/financeiro/useConferenciasCaixa";
import BtnDespesa from "../components/BtnDespesa";
import { useStoreCaixa } from "../store";

const ModalDetalheDinheiro = () => {
  const [modalOpen, closeModal, id_caixa, type] = useStoreCaixa((state) => [
    state.modalDetalheDinheiroOpen,
    state.closeModalDinheiro,
    state.id,
    state.type_detalhe,
  ]);

  const { data } = useConferenciasCaixa().getCardDetalheDinheiro({ id_caixa, type });

  function handleClickCancel() {
    closeModal();
  }

  if (!modalOpen) return null;
  const { rows, ...dadosCaixa } = data || [];

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "entrada" ? "Entradas em Dinheiro" : "Despesas de Caixa"}
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <Table
          className="rounded-md border-border w-full h-10 overflow-clip relative"
          divClassname="overflow-auto scroll-thin max-h-[70vh] border rounded-md mt-2"
        >
          <TableHeader className="sticky w-full top-0 h-10 border-b-2 border-border rounded-t-md bg-secondary">
            <TableRow>
              {type === "saida" && <TableHead>Ação</TableHead>}
              <TableHead>Data</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Tipo</TableHead>
              {type === "entrada" && <TableHead>Forma Pgto</TableHead>}
              <TableHead>Histórico</TableHead>
              <TableHead>Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows?.map((row: any, index: number) => (
              <TableRow
                key={`boleto_caixa: ${index} - ${row.data_caixa}`}
                className="uppercase odd:bg-secondary/60 even:bg-secondary/40"
              >
                {type === "saida" && (
                  <TableCell>
                    {row.tipo_operacao !== "RETIRADA" ? (
                      <BtnDespesa
                        dadosCaixa={dadosCaixa}
                        dadosDespesa={row}
                        id_titulo={row.id_cp_titulo}
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                )}
                <TableCell>{normalizeDate(row.data)}</TableCell>
                <TableCell>{row.documento}</TableCell>
                <TableCell>{row.tipo_operacao}</TableCell>
                {type === "entrada" && <TableCell>{row.forma_pagamento}</TableCell>}
                <TableCell>{row.historico}</TableCell>
                <TableCell>{normalizeCurrency(row.valor)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetalheDinheiro;
