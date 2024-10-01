// import SelectMultiFormaPagamento from "@/components/custom/SelectMultiFormaPagamento";
import { Input } from "@/components/custom/FormInput";
import { SelectGrupoEconomico } from "@/components/custom/SelectGrupoEconomico";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import { useStoreTableTesouraria } from "./table/store-table";

const status = [
  { label: "AGUARDANDO EMISSÃO", value: "aguardando_emissao" },
  { label: "EMITIDO", value: "emitido" },
  { label: "EM PAGAMENTO", value: "em_pagamento" },
  { label: "PAGO", value: "pago" },
  { label: "CANCELADO", value: "cancelado" },
  { label: "ATRASADO", value: "atrasado" },
  { label: "ERRO", value: "erro" },
];

const FiltersTesouraria = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableTesouraria((state) => state.filters);
  const setFilters = useStoreTableTesouraria((state) => state.setFilters);
  const resetFilters = useStoreTableTesouraria((state) => state.resetFilters);

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
              <SelectGrupoEconomico
                className="max-w-full w-full flex-nowrap"
                value={filters.id_grupo_economico}
                onChange={(value) => {
                  setFilters({ id_grupo_economico: value });
                }}
              />
              <Input
                value={filters.conta}
                onChange={(e) => setFilters({ conta: e.target.value })}
                placeholder="Conta"
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FiltersTesouraria;
