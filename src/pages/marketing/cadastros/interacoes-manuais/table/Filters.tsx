import { AccordionItem } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionTrigger } from "@radix-ui/react-accordion";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import { useStoreTableInteracoesManuais } from "./store-table";

const FiltersInteracoesManuais = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableInteracoesManuais((state) => state.filters);
  const setFilters = useStoreTableInteracoesManuais((state) => state.setFilters);
  const resetFilters = useStoreTableInteracoesManuais((state) => state.resetFilters);

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
          <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-2 lg:pb-0">
            <div className="flex w-max space-x-3">
              <Input
                placeholder="Cliente"
                className="max-w-[200px]"
                value={filters.cliente}
                onChange={(e) => {
                  setFilters({ cliente: e.target.value });
                }}
              />
              <Input
                placeholder="Operador"
                className="max-w-[200px]"
                value={filters.operador}
                onChange={(e) => {
                  setFilters({ operador: e.target.value });
                }}
              />
              <Input
                placeholder="Observação"
                className="max-w-[200px]"
                value={filters.observacao}
                onChange={(e) => {
                  setFilters({ observacao: e.target.value });
                }}
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FiltersInteracoesManuais;
