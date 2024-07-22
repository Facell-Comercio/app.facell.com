import SelectCentrosCustos from "@/components/custom/SelectCentrosCustos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { ScrollArea } from "@radix-ui/react-scroll-area";
import { SelectGrupoEconomico } from "@/components/custom/SelectGrupoEconomico";
import SelectMes from "@/components/custom/SelectMes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import { useStoreTableMeuOrcamento } from "./store-table";

const FilterMeuOrcamento = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableMeuOrcamento((state) => state.filters);
  const setFilters = useStoreTableMeuOrcamento((state) => state.setFilters);
  const resetFilters = useStoreTableMeuOrcamento((state) => state.resetFilters);

  const handleClickFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    refetch();
  };
  const handleResetFilter = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await new Promise((resolve) => resolve(resetFilters()));
    refetch();
  };

  const [itemOpen, setItemOpen] = useState<string>("item-1");
  return (
    <Accordion
      type="single"
      collapsible
      value={itemOpen}
      onValueChange={(e) => setItemOpen(e)}
      className="p-2 border dark:border-slate-800 rounded-lg "
    >
      <AccordionItem value="item-1" className="relative border-0">
        <div className="flex gap-3 items-center absolute start-16 top-1">
          <Button size={"xs"} onClick={handleClickFilter}>
            Aplicar <FilterIcon size={12} className="ms-2" />
          </Button>
          <Button size={"xs"} variant="secondary" onClick={handleResetFilter}>
            Limpar <EraserIcon size={12} className="ms-2" />
          </Button>
        </div>

        <AccordionTrigger className={`py-1 hover:no-underline`}>
          <span className="">Filtros</span>
        </AccordionTrigger>
        <AccordionContent className="p-0 pt-3">
          <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-4">
            <div className="flex items-end w-max space-x-3 pb-1">
              <div>
                <label className="text-sm font-medium">Mês</label>
                <SelectMes
                  value={filters.mes}
                  onValueChange={(e) => {
                    setFilters({ mes: e });
                  }}
                />
              </div>
              <div>
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
              <div>
                <label className="text-sm font-medium">Grupo Econômico</label>
                <SelectGrupoEconomico
                  showAll
                  value={filters?.id_grupo_economico}
                  onChange={(id_grupo_economico) => {
                    setFilters({ id_grupo_economico: id_grupo_economico });
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Centro de custo</label>
                <SelectCentrosCustos
                  placeholder="Selecione..."
                  value={filters?.id_centro_custo}
                  id_grupo_economico={filters.id_grupo_economico}
                  onChange={(id_centro_custo) => {
                    setFilters({ id_centro_custo: id_centro_custo });
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Plano de Contas</label>
                <Input
                  placeholder="Digite..."
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
