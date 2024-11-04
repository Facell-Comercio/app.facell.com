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
import { useStorePrevisaoPagamentoRelatorio } from "./store";

type RelatorioAccordionProps = {
  itemOpen: string;
  setItemOpen: (itemOpen: string) => void;
};

const PrevisaoPagamentoRelatorio = ({ itemOpen, setItemOpen }: RelatorioAccordionProps) => {
  const [filters, setFilters, resetFilters] = useStorePrevisaoPagamentoRelatorio((state) => [
    state.filters,
    state.setFilters,
    state.resetFilters,
  ]);
  const { mutate: exportPrevisaoPagamentoCR, isPending } =
    useRelatorios().exportPrevisaoPagamentoCR();
  function handleExportPrevisaoPagamentoCR() {
    if (!filters.range_data?.from || !filters.range_data?.to) {
      toast({
        title: "Ops!",
        description: "Preencha o período",
        variant: "warning",
      });
      return;
    }
    exportPrevisaoPagamentoCR(filters);
  }
  return (
    <Accordion
      type="single"
      value={itemOpen}
      onValueChange={(e) => setItemOpen(e)}
      collapsible
      className="p-2 border dark:border-slate-800 rounded-lg "
    >
      <AccordionItem value="previsao-pagamento-relatorio" className="relative border-0">
        <AccordionTrigger className={`py-1 hover:no-underline`}>
          Relatório de Previsão de Pagamento
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
                  <SelectItem value="data_vencimento">Vencimento</SelectItem>
                  <SelectItem value="data_prevista">Previsão</SelectItem>
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
            <Button
              variant={"success"}
              onClick={handleExportPrevisaoPagamentoCR}
              disabled={isPending}
            >
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

export default PrevisaoPagamentoRelatorio;
