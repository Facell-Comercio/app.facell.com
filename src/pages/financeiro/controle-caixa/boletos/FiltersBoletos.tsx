// import SelectMultiFormaPagamento from "@/components/custom/SelectMultiFormaPagamento";
import { SelectMultiFilial } from "@/components/custom/SelectFilial";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range";
import { MultiSelect } from "@/components/ui/multi-select";
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
import { useStoreTableBoletos } from "./table/store-table";

const status = [
  { label: "AGUARDANDO EMISSÃO", value: "aguardando_emissao" },
  { label: "EMITIDO", value: "emitido" },
  { label: "EM PAGAMENTO", value: "em_pagamento" },
  { label: "PAGO", value: "pago" },
  { label: "CANCELADO", value: "cancelado" },
  { label: "ATRASADO", value: "atrasado" },
];

const FiltersBoletos = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableBoletos((state) => state.filters);
  const setFilters = useStoreTableBoletos((state) => state.setFilters);
  const resetFilters = useStoreTableBoletos((state) => state.resetFilters);

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
              <MultiSelect
                options={status.map((item) => ({
                  value: item.value,
                  label: item.label,
                }))}
                onValueChange={(value) => {
                  setFilters({ status_list: value });
                }}
                defaultValue={filters.status_list || []}
                placeholder="Status"
                variant="inverted"
                animation={4}
                maxCount={2}
                className="max-w-full w-full flex-nowrap"
                nowrap
              />
              <SelectMultiFilial
                className="max-w-full w-full flex-nowrap"
                value={filters.filiais_list || []}
                onChange={(value) => {
                  setFilters({ filiais_list: value });
                  refetch();
                }}
                maxCount={2}
                isLojaTim
                nowrap
              />
              <Select
                value={filters.tipo_data}
                onValueChange={(tipo_data) => {
                  setFilters({ tipo_data: tipo_data });
                }}
              >
                <SelectTrigger className="min-w-[140px]">
                  <SelectValue placeholder="Tipo de Data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="data">Criação</SelectItem>
                  <SelectItem value="data_emissao">Emissão</SelectItem>
                  <SelectItem value="data_vencimento">Vencimento</SelectItem>
                </SelectContent>
              </Select>
              <DatePickerWithRange
                date={filters.range_data}
                setDate={(date) => {
                  setFilters({ range_data: date });
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

export default FiltersBoletos;
