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
import ModalContasBancarias, {
  ItemContaBancariaProps,
} from "@/pages/financeiro/components/ModalContasBancarias";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import { useStoreTableConciliacaoCP } from "./store-tables";

const FiltersConciliacaoCP = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableConciliacaoCP((state) => state.filters);
  const setFilters = useStoreTableConciliacaoCP((state) => state.setFilters);
  const resetFilters = useStoreTableConciliacaoCP(
    (state) => state.resetFilters
  );
  const [modalContaBancariaOpen, setModalContaBancariaOpen] =
    useState<boolean>(false);

  const handleClickFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    refetch();
  };
  const handleResetFilter = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await new Promise((resolve) => resolve(resetFilters()));
    refetch();
  };

  function handleSelectionContaBancaria(item: ItemContaBancariaProps) {
    setFilters({ id_conta_bancaria: item.id, conta_bancaria: item.descricao });
    setModalContaBancariaOpen(false);
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="p-2 border-2 dark:border-slate-800 rounded-lg "
    >
      <AccordionItem
        defaultChecked={false}
        value="item-1"
        className="relative border-0"
      >
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
            <div className="flex w-max space-x-4">
              <DatePickerWithRange
                description="Período de transação"
                date={filters.range_data}
                setDate={(range_data) => {
                  setFilters({ range_data: range_data });
                }}
              />
              <Input
                value={filters.conta_bancaria}
                className="flex-1 max-h-10 min-w-[26ch]"
                readOnly
                placeholder="Conta Bancaria"
                onClick={() => setModalContaBancariaOpen(true)}
              />
              <ModalContasBancarias
                open={modalContaBancariaOpen}
                handleSelecion={handleSelectionContaBancaria}
                onOpenChange={() => setModalContaBancariaOpen((prev) => !prev)}
                // id_matriz={id_matriz || ""}
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FiltersConciliacaoCP;
