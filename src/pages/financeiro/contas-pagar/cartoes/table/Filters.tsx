import SelectMatriz from "@/components/custom/SelectMatriz";
import { AccordionItem } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import { useStoreTableCartao } from "./store-table";

const FiltersCartao = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableCartao((state) => state.filters);
  const setFilters = useStoreTableCartao((state) => state.setFilters);
  const resetFilters = useStoreTableCartao((state) => state.resetFilters);

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
              <SelectMatriz
                showAll
                value={filters?.id_matriz}
                onChange={(id_matriz) => {
                  setFilters({ id_matriz: id_matriz });
                }}
              />
              <Input
                placeholder="Descrição"
                className="max-w-[200px]"
                value={filters.descricao}
                onChange={(e) => {
                  setFilters({ descricao: e.target.value });
                }}
              />
              <Input
                placeholder="Portador"
                className="max-w-[200px]"
                value={filters.nome_portador}
                onChange={(e) => {
                  setFilters({ nome_portador: e.target.value });
                }}
              />
              <Select
                value={filters.active}
                onValueChange={(ativo) => {
                  setFilters({ active: ativo });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Inativo</SelectItem>
                  <SelectItem value="1">Ativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FiltersCartao;
