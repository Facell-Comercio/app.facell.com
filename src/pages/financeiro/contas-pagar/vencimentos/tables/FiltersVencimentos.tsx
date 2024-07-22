import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import { useStoreTableVencimentos } from "./store";
import SelectMatriz from "@/components/custom/SelectMatriz";

const FiltersVencimentos = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableVencimentos((state) => state.filters);
  const setFilters = useStoreTableVencimentos((state) => state.setFilters);
  const resetFilters = useStoreTableVencimentos((state) => state.resetFilters);

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
            <div className="flex w-max space-x-3">
              <Input
                type="number"
                placeholder="ID VENCIMENTO"
                className="w-[80px]"
                value={filters?.id_vencimento}
                onChange={(e) => {
                  setFilters({ id_vencimento: e.target.value });
                }}
                min={0}
              />

              <Input
                type="number"
                placeholder="ID TITULO"
                className="w-[80px]"
                value={filters?.id_titulo}
                onChange={(e) => {
                  setFilters({ id_titulo: e.target.value });
                }}
                min={0}
              />


              <SelectMatriz
                showAll={true}
                value={filters.id_matriz}
                onChange={(id_matriz) => {
                  setFilters({ id_matriz: id_matriz });
                }}
              />

              <Select
                value={filters.tipo_data}
                onValueChange={(tipo_data) => {
                  setFilters({ tipo_data: tipo_data });
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
                  setFilters({ range_data: date });
                }}
              />

              <Input
                className="max-w-[200px]"
                value={filters.descricao}
                onChange={(e) => setFilters({ descricao: e.target.value })}
                placeholder="Descrição..."
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FiltersVencimentos;
