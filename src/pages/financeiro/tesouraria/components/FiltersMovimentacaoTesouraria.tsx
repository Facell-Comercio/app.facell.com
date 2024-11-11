// import SelectMultiFormaPagamento from "@/components/custom/SelectMultiFormaPagamento";
import { Input } from "@/components/custom/FormInput";
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
import { EraserIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import { useStoreTesouraria } from "../store";

const tipos = [
  { label: "CRÉDITO", value: "CREDIT" },
  { label: "DÉBITO", value: "DEBIT" },
];

const FiltersMovimentacaoTesouraria = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTesouraria((state) => state.filters);
  const setFilters = useStoreTesouraria((state) => state.setFilters);
  const resetFilters = useStoreTesouraria((state) => state.resetFilters);

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
      className="p-2 border bg-secondary/40 rounded-lg "
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
          <ScrollArea className="w-fill whitespace-nowrap rounded-md">
            <div className="flex w-max space-x-3">
              <MultiSelect
                options={tipos.map((tipo: any) => ({
                  value: tipo.value,
                  label: tipo.label,
                }))}
                onValueChange={(res) => setFilters({ tipo_list: res })}
                defaultValue={filters.tipo_list || []}
                placeholder="Tipos"
                animation={4}
                className="bg-background hover:bg-background"
                variant={"secondary"}
                nowrap
                maxCount={2}
              />
              <DatePickerWithRange
                date={filters.range_data}
                setDate={(date) => {
                  setFilters({ range_data: date });
                }}
              />
              <Input
                value={filters.descricao}
                onChange={(e) => setFilters({ descricao: e.target.value })}
                placeholder="Descriçao"
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FiltersMovimentacaoTesouraria;
