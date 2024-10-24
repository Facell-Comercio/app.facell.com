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
import { toast } from "@/components/ui/use-toast";
import ModalContasBancarias, {
  ItemContaBancariaProps,
} from "@/pages/financeiro/components/ModalContasBancarias";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import { useStoreTableConciliacaoCR } from "./store-tables";

export const FiltersConciliacaoCP = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableConciliacaoCR((state) => state.filters);
  const setFilters = useStoreTableConciliacaoCR((state) => state.setFilters);
  const setFiltersConciliacoes = useStoreTableConciliacaoCR(
    (state) => state.setFiltersConciliacoes
  );
  const resetFilters = useStoreTableConciliacaoCR((state) => state.resetFilters);
  const [modalContaBancariaOpen, setModalContaBancariaOpen] = useState<boolean>(false);
  const [resetSelections, setShowAccordion] = useStoreTableConciliacaoCR((state) => [
    state.resetSelections,
    state.setShowAccordion,
  ]);

  const handleClickFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (
      filters.id_conta_bancaria &&
      filters.range_data &&
      filters.range_data.from &&
      filters.range_data.to
    ) {
      e.stopPropagation();
      resetSelections();
      refetch();
      setShowAccordion(true);
    } else {
      toast({
        title: "Filtros incompletos",
        description: "Selecione o período de transação e a conta bancária",
        variant: "warning",
      });
    }
  };
  const handleResetFilter = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    resetSelections();
    setShowAccordion(false);
    await new Promise((resolve) => resolve(resetFilters()));
    refetch();
  };

  function handleSelectionContaBancaria(item: ItemContaBancariaProps) {
    setFilters({ id_conta_bancaria: item.id, conta_bancaria: item.descricao });
    setFiltersConciliacoes({ id_filial: item.id_matriz });

    setModalContaBancariaOpen(false);
  }
  const [itemOpen, setItemOpen] = useState<string>("item-1");

  return (
    <Accordion
      type="single"
      collapsible
      value={itemOpen}
      onValueChange={(e) => setItemOpen(e)}
      className="p-2 border dark:border-slate-800 rounded-lg "
    >
      <AccordionItem defaultChecked={false} value="item-1" className="relative border-0">
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
          <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-1">
            <div className="flex w-max space-x-3">
              <Input
                value={filters.conta_bancaria}
                className="flex-1 max-h-10 min-w-[36ch]"
                readOnly
                placeholder="Conta Bancaria"
                onClick={() => setModalContaBancariaOpen(true)}
              />

              <DatePickerWithRange
                description="Período de transação"
                date={filters.range_data}
                setDate={(range_data) => {
                  setFilters({ range_data: range_data });
                }}
              />

              <ModalContasBancarias
                open={modalContaBancariaOpen}
                handleSelection={handleSelectionContaBancaria}
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

export const FiltersRealizados = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableConciliacaoCR((state) => state.filtersConciliacoes);
  const setFilters = useStoreTableConciliacaoCR((state) => state.setFiltersConciliacoes);
  const resetFilters = useStoreTableConciliacaoCR((state) => state.resetFiltersConciliacoes);

  const handleClickFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (filters.range_data && filters.range_data.from && filters.range_data.to) {
      e.stopPropagation();
      refetch();
    } else {
      toast({
        title: "Filtros incompletos",
        description: "Selecione o período de conciliação",
        variant: "warning",
      });
    }
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
      <AccordionItem defaultChecked={false} value="item-1" className="relative border-0">
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
          <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-1">
            <div className="flex w-max space-x-3">
              <DatePickerWithRange
                description="Período de conciliação"
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
