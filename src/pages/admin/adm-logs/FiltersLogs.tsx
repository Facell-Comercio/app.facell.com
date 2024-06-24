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
import { useStoreLogs } from "./store";

const FiltersLogs = ({ refetch }: { refetch: () => void }) => {
  const [filters, setFilters, resetFilters] = useStoreLogs((state) => [
    state.filters,
    state.setFilters,
    state.resetFilters,
  ]);

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
          <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-4 lg:pb-0">
            <div className="flex w-max space-x-4">
              <Select
                value={filters.level}
                onValueChange={(level) => {
                  setFilters({ level: level });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">Error</SelectItem>
                  <SelectItem value="30">Info</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Módulo"
                className="w-[180px]"
                value={filters?.module}
                onChange={(e) => {
                  setFilters({ module: e.target.value });
                }}
              />
              <Input
                placeholder="Origem"
                className="w-[180px]"
                value={filters?.origin}
                onChange={(e) => {
                  setFilters({ origin: e.target.value });
                }}
              />
              <Input
                placeholder="Método"
                className="w-[180px]"
                value={filters?.method}
                onChange={(e) => {
                  setFilters({ method: e.target.value });
                }}
              />

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

export default FiltersLogs;
