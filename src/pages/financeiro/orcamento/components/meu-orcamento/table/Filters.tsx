import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollBar } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useRef } from "react";
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

  async function handleSearch(text: string) {
    await new Promise((resolve) => {
      setFilters({ termo: text });
      resolve(true);
    });
    refetch();
  }

  const searchRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex gap-3">
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
              <div className="flex w-max space-x-4">
                <Button onClick={handleClickFilter}>
                  Filtrar <FilterIcon size={12} className="ms-2" />
                </Button>
                <Button onClick={handleResetFilter} variant="destructive">
                  Limpar <EraserIcon size={12} className="ms-2" />
                </Button>

                <Input
                  type="number"
                  min={1}
                  max={12}
                  step={"1"}
                  placeholder="Mês"
                  className="max-w-[200px]"
                  value={filters.mes}
                  onChange={(e) => {
                    setFilters({ mes: e.target.value });
                  }}
                />
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
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <span>
        <Input ref={searchRef} type="search" placeholder="Buscar..." />
        <Button onClick={() => handleSearch(searchRef.current?.value || "")}>
          Procurar
        </Button>
      </span>
    </div>
  );
};

export default FilterMeuOrcamento;
