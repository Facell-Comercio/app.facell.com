import SelectContaBancaria from "@/components/custom/SelectContaBancaria";
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
import { useStoreTableBorderos } from "./store-table";

const FiltersBorderos = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableBorderos((state) => state.filters);
  const setFilters = useStoreTableBorderos((state) => state.setFilters);
  const resetFilters = useStoreTableBorderos((state) => state.resetFilters);

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
            <div className="flex w-max space-x-4">
              <Button onClick={handleClickFilter}>
                Filtrar <FilterIcon size={12} className="ms-2" />
              </Button>
              <Button onClick={handleResetFilter} variant="destructive">
                Limpar <EraserIcon size={12} className="ms-2" />
              </Button>

              <SelectContaBancaria
                placeholder="Selecione..."
                value={filters.id_conta_bancaria}
                onChange={(id_conta_bancaria) => {
                  setFilters({ id_conta_bancaria: id_conta_bancaria });
                }}
              />
              <Input
                placeholder="Banco"
                className="max-w-[200px]"
                value={filters.banco}
                onChange={(e) => {
                  setFilters({ banco: e.target.value });
                }}
              />
              <Input
                placeholder="Fornecedor"
                className="max-w-[200px]"
                value={filters.fornecedor}
                onChange={(e) => {
                  setFilters({ fornecedor: e.target.value });
                }}
              />
              <Input
                placeholder="ID Título"
                className="w-[20ch]"
                value={filters.id_titulo}
                onChange={(e) => {
                  setFilters({ id_titulo: e.target.value });
                }}
              />
              <Input
                placeholder="Nº Doc"
                className="w-[20ch]"
                value={filters.num_doc}
                onChange={(e) => {
                  setFilters({ num_doc: e.target.value });
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
                  <SelectItem value="data_pagamento">Pagamento</SelectItem>
                </SelectContent>
              </Select>
              <DatePickerWithRange
                date={filters.range_data}
                setDate={(range_data) => {
                  setFilters({ range_data: range_data });
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

export default FiltersBorderos;
