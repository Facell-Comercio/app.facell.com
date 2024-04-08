import SelectCentrosCustos from "@/components/custom/SelectCentrosCustos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useStoreTableMeuOrcamento } from "./store-table";

const FilterMeuOrcamento = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableMeuOrcamento((state) => state.filters);
  const setFilters = useStoreTableMeuOrcamento((state) => state.setFilters);
  const resetFilters = useStoreTableMeuOrcamento((state) => state.resetFilters);

  const handleClickFilter = () => refetch();
  const handleResetFilter = async () => {
    await new Promise((resolve) => resolve(resetFilters()));
    refetch();
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="p-2 border-2 dark:border-slate-800 rounded-lg "
    >
      <AccordionItem value="item-1" className="border-0">
        <AccordionTrigger className="py-1 hover:no-underline">
          Filtros
        </AccordionTrigger>
        <AccordionContent className="p-0">
          <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-4">
            <div className="flex items-end w-max space-x-4">
              <Button onClick={handleClickFilter}>
                Filtrar <FilterIcon size={12} className="ms-2" />
              </Button>
              <Button onClick={handleResetFilter} variant="destructive">
                Limpar <EraserIcon size={12} className="ms-2" />
              </Button>

              <div className="max-w-[200px]">
                <label className="text-sm font-medium">Mês</label>
                <Input
                  type="number"
                  min={1}
                  max={12}
                  step={"1"}
                  placeholder="Mês"
                  value={filters.mes}
                  onChange={(e) => {
                    setFilters({ mes: e.target.value });
                  }}
                />
              </div>
              <div className="max-w-[200px]">
                <label className="text-sm font-medium">Ano</label>
                <Input
                  type="number"
                  min={2020}
                  max={new Date().getFullYear() + 1}
                  step={"1"}
                  placeholder="Ano"
                  className="w-[80px]"
                  value={filters.ano}
                  onChange={(e) => {
                    setFilters({ ano: e.target.value });
                  }}
                />
              </div>
              <div className="max-w-[200px]">
                <label className="text-sm font-medium">Centro de custo</label>
                <SelectCentrosCustos
                  placeholder="Selecione..."
                  value={filters?.id_centro_custo}
                  onChange={(id_centro_custo) => {
                    setFilters({ id_centro_custo: id_centro_custo });
                  }}
                />
              </div>
              <div className="max-w-[200px]">
                <label className="text-sm font-medium">Plano de Contas</label>
                <Input
                  placeholder="Digite..."
                  className="max-w-[200px]"
                  value={filters?.plano_contas}
                  onChange={(e) => {
                    setFilters({ plano_contas: e.target.value });
                  }}
                />
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FilterMeuOrcamento;
