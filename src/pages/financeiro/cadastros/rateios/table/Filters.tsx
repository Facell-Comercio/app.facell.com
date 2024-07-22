import { SelectGrupoEconomico } from "@/components/custom/SelectGrupoEconomico";
import SelectIsActive from "@/components/custom/SelectIsActive";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import { useStoreTableRateios } from "./store-table";

const FiltersRateios = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableRateios((state) => state.filters);
  const setFilters = useStoreTableRateios((state) => state.setFilters);
  const resetFilters = useStoreTableRateios((state) => state.resetFilters);

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
      className="p-2 border-2 dark:border-slate-800 rounded-lg "
    >
      <AccordionItem value="item-1" className="border-0">
        <AccordionTrigger className="py-1 hover:no-underline">
          Filtros
        </AccordionTrigger>
        <AccordionContent className="p-0">
          <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-4">
            <div className="flex w-max space-x-3">
              <Button onClick={handleClickFilter}>
                Filtrar <FilterIcon size={12} className="ms-2" />
              </Button>
              <Button onClick={handleResetFilter} variant="destructive">
                Limpar <EraserIcon size={12} className="ms-2" />
              </Button>

              <Input
                placeholder="Nome"
                className="max-w-[200px]"
                value={filters.nome}
                onChange={(e) => {
                  setFilters({ nome: e.target.value });
                }}
              />
              <Input
                placeholder="Código"
                className="w-[80px]"
                value={filters.codigo}
                onChange={(e) => {
                  setFilters({ codigo: e.target.value });
                }}
              />
              <SelectGrupoEconomico
                showAll
                value={filters.id_grupo_economico}
                onChange={(id_grupo_economico) => {
                  setFilters({ id_grupo_economico: id_grupo_economico });
                }}
              />
              {/* <Select
                value={filters.active}
                onValueChange={(active) => setFilters({ active: active })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Inativo</SelectItem>
                  <SelectItem value="1">Ativo</SelectItem>
                </SelectContent>
              </Select> */}
              <SelectIsActive
                value={filters.active}
                onChange={(active) => setFilters({ active: active })}
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FiltersRateios;
