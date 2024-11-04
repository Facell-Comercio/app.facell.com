import fetchApi from "@/api/fetchApi";
import { SelectMultiGrupoEconomico } from "@/components/custom/SelectGrupoEconomico";
import { SelectMultiStatusCP } from "@/components/custom/SelectMultiStatus";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { exportToExcel } from "@/helpers/importExportXLS";
import { normalizeDate } from "@/helpers/mask";
import { TituloSchemaProps } from "@/pages/financeiro/contas-pagar/titulos/titulo/form-data";
import { formatDate } from "date-fns";
import { Download, EraserIcon } from "lucide-react";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { useStoreSolicitacoesCriadasRelatorio } from "./store";

interface TituloProps extends TituloSchemaProps {
  solicitante?: string;
  forma_pagamento?: string;
  fornecedor?: string;
}

type RelatorioAccordionProps = {
  itemOpen: string;
  setItemOpen: (itemOpen: string) => void;
};

const SolicitacoesCriadasRelatorio = ({ itemOpen, setItemOpen }: RelatorioAccordionProps) => {
  const [filters, setFilters, resetFilters] = useStoreSolicitacoesCriadasRelatorio((state) => [
    state.filters,
    state.setFilters,
    state.resetFilters,
  ]);
  const [isPending, setIsPending] = useState(false);
  async function exportSolicitacao() {
    if (!filters.range_data?.from || !filters.range_data?.to) {
      toast({
        title: "Ops!",
        description: "Preencha o período",
        variant: "warning",
      });
      return;
    }
    setIsPending(true);
    const response = await fetchApi.financeiro.contas_pagar.titulos.getAll({
      filters,
    });

    const rows = response?.rows || [];
    const data = rows.map((row: TituloProps) => {
      return {
        ID: row.id,
        STATUS: row.status,
        "CRIADO EM": normalizeDate(row.created_at || ""),
        "NUM DOC": row.num_doc,
        DESCRIÇÃO: row.descricao,
        VALOR: parseFloat(row.valor),
        FILIAL: row.filial,
        FORNECEDOR: row.nome_fornecedor,
        "CNPJ FORNECEDOR": row.cnpj_fornecedor,
        SOLICITANTE: row.solicitante,
        "FORMA DE PAGAMENTO": row.forma_pagamento,
      };
    });
    exportToExcel(data, `EXPORT DESPESAS ${formatDate(new Date(), "dd-MM-yyyy hh.mm")}`);
    setIsPending(false);
  }
  return (
    <Accordion
      type="single"
      value={itemOpen}
      onValueChange={(e) => setItemOpen(e)}
      collapsible
      className="p-2 border dark:border-slate-800 rounded-lg "
    >
      <AccordionItem value="solicitacoes-relatorio" className="relative border-0">
        <AccordionTrigger className={`py-1 hover:no-underline`}>
          Relatório de Solicitações Criadas
        </AccordionTrigger>
        <AccordionContent className="space-y-0.5 p-0 pt-3">
          <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-3">
            <div className="flex w-max space-x-3">
              <Select
                value={filters.tipo_data}
                onValueChange={(tipo_data) => {
                  setFilters({
                    tipo_data: tipo_data,
                  });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Criação</SelectItem>
                  <SelectItem value="data_emissao">Emissão</SelectItem>
                  <SelectItem value="data_vencimento">Vencimento</SelectItem>
                  <SelectItem value="data_prevista">Previsão</SelectItem>
                  <SelectItem value="data_pagamento">Pagamento</SelectItem>
                </SelectContent>
              </Select>

              <DatePickerWithRange
                date={filters.range_data}
                setDate={(date) => {
                  setFilters({
                    range_data: date,
                  });
                }}
              />
              <SelectMultiStatusCP
                className="w-fit"
                value={filters.status_list || []}
                onChange={(value) =>
                  setFilters({
                    status_list: value,
                  })
                }
              />
              <SelectMultiGrupoEconomico
                className="w-fit"
                value={filters.grupo_economico_list || []}
                onChange={(value) => {
                  setFilters({
                    grupo_economico_list: value,
                  });
                }}
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <span className="flex w-full gap-2 justify-end ">
            <Button variant={"success"} onClick={exportSolicitacao} disabled={isPending}>
              {isPending ? (
                <>
                  <FaSpinner size={18} className="me-2 animate-spin" /> Exportando...
                </>
              ) : (
                <>
                  <Download className="me-2" size={18} />
                  Exportar
                </>
              )}
            </Button>
            <Button variant={"secondary"} onClick={() => resetFilters()} disabled={isPending}>
              <EraserIcon size={18} className="me-2" /> Limpar
            </Button>
          </span>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SolicitacoesCriadasRelatorio;
