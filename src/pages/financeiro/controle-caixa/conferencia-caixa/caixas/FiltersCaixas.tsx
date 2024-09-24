// import SelectMultiFormaPagamento from "@/components/custom/SelectMultiFormaPagamento";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  ScrollArea,
  ScrollBar,
} from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EraserIcon,
  FilterIcon,
} from "lucide-react";
import { useState } from "react";
import { useStoreTableCaixas } from "./table/store-table";

const status = ["A CONFERIR", "CONFERIDO", "CONFIRMADO"];

const FiltersCaixas = ({
  refetch,
}: {
  refetch: () => void;
}) => {
  const filters = useStoreTableCaixas(
    (state) => state.filters
  );
  const setFilters = useStoreTableCaixas(
    (state) => state.setFilters
  );
  const resetFilters = useStoreTableCaixas(
    (state) => state.resetFilters
  );

  const handleClickFilter = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    // console.log(filters);

    refetch();
  };
  const handleResetFilter = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    await new Promise((resolve) =>
      resolve(resetFilters())
    );

    refetch();
  };

  const [itemOpen, setItemOpen] =
    useState<string>("item-1");

  return (
    <Accordion
      type="single"
      collapsible
      value={itemOpen}
      onValueChange={(e) => setItemOpen(e)}
      className="p-2 border dark:border-slate-800 rounded-lg "
    >
      <AccordionItem
        value="item-1"
        className="relative border-0"
      >
        <div className="flex gap-3 items-center absolute start-16 top-1">
          <Button
            size={"xs"}
            onClick={handleClickFilter}
          >
            Aplicar{" "}
            <FilterIcon
              size={12}
              className="ms-2"
            />
          </Button>
          <Button
            size={"xs"}
            variant="secondary"
            onClick={handleResetFilter}
          >
            Limpar{" "}
            <EraserIcon
              size={12}
              className="ms-2"
            />
          </Button>
        </div>

        <AccordionTrigger
          className={`py-1 hover:no-underline`}
        >
          <span className="">Filtros</span>
        </AccordionTrigger>

        <AccordionContent className="p-0 pt-3">
          <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-4">
            <div className="flex w-max space-x-3">
              <MultiSelect
                options={status.map((value) => ({
                  value: value,
                  label: value,
                }))}
                onValueChange={(value) => {
                  setFilters({
                    status_list: value,
                  });
                }}
                defaultValue={
                  filters.status_list || []
                }
                placeholder="Status"
                variant="secondary"
                animation={4}
                maxCount={2}
                className="min-w-[180px]"
              />

              <DatePickerWithRange
                date={filters.range_data}
                setDate={(date) => {
                  setFilters({
                    range_data: date,
                  });
                }}
              />

              <Select
                value={filters.divergentes}
                onValueChange={(ativo) => {
                  setFilters({
                    divergentes: ativo,
                  });
                }}
              >
                <SelectTrigger className="min-w-[180px] w-fit">
                  <SelectValue placeholder="Divergentes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">
                    Todos os caixas
                  </SelectItem>
                  <SelectItem value="1">
                    Somente caixas divergentes
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.nao_resolvidos}
                onValueChange={(ativo) => {
                  setFilters({
                    nao_resolvidos: ativo,
                  });
                }}
              >
                <SelectTrigger className="min-w-[180px] w-fit">
                  <SelectValue placeholder="Ocorrências" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">
                    Todas ocorrências
                  </SelectItem>
                  <SelectItem value="1">
                    Ocorrências não resolvidas
                  </SelectItem>
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

export default FiltersCaixas;
