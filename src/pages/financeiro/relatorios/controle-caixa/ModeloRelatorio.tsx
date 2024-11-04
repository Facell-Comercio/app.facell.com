import { Input } from "@/components/custom/FormInput";
import SelectMes from "@/components/custom/SelectMes";
import { SelectMultiUF } from "@/components/custom/SelectUF";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useRelatorios } from "@/hooks/financeiro/useRelatorios";
import { Download, EraserIcon } from "lucide-react";
import { FaSpinner } from "react-icons/fa6";
import { useStoreRelatorioControleCaixa } from "./store";

type RelatorioAccordionProps = {
  itemOpen: string;
  setItemOpen: (itemOpen: string) => void;
  title: string;
  nomeLayout: RelatorioLayoutName;
};

type RelatorioLayoutName =
  | "exportLayoutRV"
  | "exportLayoutPIX"
  | "exportLayoutPitzi"
  | "exportLayoutCrediario"
  | "exportLayoutTradein"
  | "exportLayoutCartoes";

const ModeloRelatorio = ({ itemOpen, setItemOpen, title, nomeLayout }: RelatorioAccordionProps) => {
  const [filters, setFilters, resetFilters] = useStoreRelatorioControleCaixa((state) => [
    state.filters,
    state.setFilters,
    state.resetFilters,
  ]);
  const { mutate: exportLayoutModelo, isPending } = useRelatorios()[nomeLayout]();
  function handleExportLayoutModelo() {
    exportLayoutModelo(filters);
  }
  return (
    <Accordion
      type="single"
      value={itemOpen}
      onValueChange={(e) => setItemOpen(e)}
      collapsible
      className="p-2 border dark:border-slate-800 rounded-lg "
    >
      <AccordionItem value={nomeLayout} className="relative border-0">
        <AccordionTrigger className={`py-1 hover:no-underline`}>{title}</AccordionTrigger>
        <AccordionContent className="space-y-0.5 p-0 pt-3">
          <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-3">
            <div className="flex w-max space-x-3">
              <SelectMes value={filters.mes} onValueChange={(mes) => setFilters({ mes })} />
              <Input
                disabled={isPending}
                type="number"
                min={2023}
                step={"1"}
                className="min-w-[20ch]"
                value={filters.ano}
                onChange={(e) =>
                  setFilters({
                    ano: e.target.value,
                  })
                }
              />
              <SelectMultiUF
                className="w-fit"
                value={filters.uf_list || []}
                onChange={(value) =>
                  setFilters({
                    uf_list: value,
                  })
                }
                nowrap
                maxCount={2}
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <span className="flex w-full gap-2 justify-end ">
            <Button variant={"success"} onClick={handleExportLayoutModelo} disabled={isPending}>
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

export default ModeloRelatorio;
