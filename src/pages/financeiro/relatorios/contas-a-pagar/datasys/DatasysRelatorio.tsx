import { InputDate } from "@/components/custom/InputDate";
import { SelectMultiGrupoEconomico } from "@/components/custom/SelectGrupoEconomico";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { useRelatorios } from "@/hooks/financeiro/useRelatorios";
import { Download, EraserIcon } from "lucide-react";
import { FaSpinner } from "react-icons/fa6";
import { useStoreDatasysRelatorio } from "./store";

type RelatorioAccordionProps = {
  itemOpen: string;
  setItemOpen: (itemOpen: string) => void;
};

const DatasysRelatorio = ({ itemOpen, setItemOpen }: RelatorioAccordionProps) => {
  const [filters, setFilters, resetFilters] = useStoreDatasysRelatorio((state) => [
    state.filters,
    state.setFilters,
    state.resetFilters,
  ]);
  const { mutate: exportLayoutDatasysCR, isPending } = useRelatorios().exportLayoutDatasysCR();
  function handleExportLaexportLayoutDatasysCR() {
    if (!filters.grupo_economico_list?.length || !filters.data_pagamento) {
      toast({
        title: "Ops!",
        description: "Preencha o grupo econômico e a data de pagamento",
        variant: "warning",
      });
      return;
    }
    exportLayoutDatasysCR(filters);
  }
  return (
    <Accordion
      type="single"
      value={itemOpen}
      onValueChange={(e) => setItemOpen(e)}
      collapsible
      className="p-2 border dark:border-slate-800 rounded-lg "
    >
      <AccordionItem value="datasys-relatorio" className="relative border-0">
        <AccordionTrigger className={`py-1 hover:no-underline`}>Layout Datasys</AccordionTrigger>
        <AccordionContent className="space-y-0.5 p-0 pt-3">
          <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-3">
            <div className="flex w-full space-x-3">
              <InputDate
                value={filters.data_pagamento}
                onChange={(date) => setFilters({ data_pagamento: date })}
              />

              <SelectMultiGrupoEconomico
                value={filters.grupo_economico_list || []}
                onChange={(grupo_economico_list) => {
                  setFilters({ grupo_economico_list: grupo_economico_list });
                }}
                maxCount={4}
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <span className="flex w-full gap-2 justify-end ">
            <Button
              variant={"success"}
              onClick={handleExportLaexportLayoutDatasysCR}
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

export default DatasysRelatorio;
