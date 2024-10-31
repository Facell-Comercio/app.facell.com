import { SelectGrupoEconomico } from "@/components/custom/SelectGrupoEconomico";
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
import { useRelatorios } from "@/hooks/financeiro/useRelatorios";
import { Download, EraserIcon } from "lucide-react";
import { FaSpinner } from "react-icons/fa6";
import { useStoreDespesasRelatorio } from "./store";

type RelatorioAccordionProps = {
  itemOpen: string;
  setItemOpen: (itemOpen: string) => void;
};

const DespesasRelatorio = ({ itemOpen, setItemOpen }: RelatorioAccordionProps) => {
  const [filters, setFilters, resetFilters] = useStoreDespesasRelatorio((state) => [
    state.filters,
    state.setFilters,
    state.resetFilters,
  ]);
  const { mutate: exportLayoutDespesas, isPending } = useRelatorios().exportLayoutDespesasCR();
  function handleExportLayoutDespesas() {
    if (!filters.range_data?.from || !filters.range_data?.to) {
      toast({
        title: "Ops!",
        description: "Preencha o período",
        variant: "warning",
      });
      return;
    }
    exportLayoutDespesas(filters);
  }
  return (
    <Accordion
      type="single"
      value={itemOpen}
      onValueChange={(e) => setItemOpen(e)}
      collapsible
      className="p-2 border dark:border-slate-800 rounded-lg "
    >
      <AccordionItem value="despesas-relatorio" className="relative border-0">
        <AccordionTrigger className={`py-1 hover:no-underline`}>
          Relatório de Despesas (Vencimentos x Rateio x Plano de contas)
        </AccordionTrigger>
        <AccordionContent className="flex flex-col w-max gap-0.5 p-0 pt-3">
          <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-4">
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

              <Select
                value={filters.em_aberto}
                onValueChange={(em_aberto) => {
                  setFilters({
                    em_aberto: em_aberto,
                  });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status Vencimento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Em aberto</SelectItem>
                  <SelectItem value="0">Fechados</SelectItem>
                </SelectContent>
              </Select>

              <SelectGrupoEconomico
                value={filters.id_grupo_economico}
                onChange={(id_grupo_economico) => {
                  setFilters({ id_grupo_economico: id_grupo_economico });
                }}
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <span className="flex w-full gap-2 justify-end ">
            <Button variant={"success"} onClick={handleExportLayoutDespesas} disabled={isPending}>
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

export default DespesasRelatorio;