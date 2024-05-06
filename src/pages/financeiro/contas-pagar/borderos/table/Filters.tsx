import SelectGrupoEconomico from "@/components/custom/SelectGrupoEconomico";
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
import ModalContasBancarias, {
  ItemContaBancariaProps,
} from "@/pages/financeiro/components/ModalContasBancarias";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import { useStoreTableBorderos } from "./store-table";

const FiltersBorderos = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableBorderos((state) => state.filters);
  const setFilters = useStoreTableBorderos((state) => state.setFilters);
  const resetFilters = useStoreTableBorderos((state) => state.resetFilters);
  const [modalContaBancariaOpen, setModalContaBancariaOpen] =
    useState<boolean>(false);
  const [contaBancaria, setContaBancaria] = useState("");

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
    setContaBancaria(item.descricao);
    setFilters({ id_conta_bancaria: item.id });
    setModalContaBancariaOpen(false);
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="p-2 border-2 dark:border-slate-800 rounded-lg "
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
            <div className="flex w-max space-x-4">
              <Input
                value={contaBancaria}
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
              <Input
                placeholder="Banco"
                className="max-w-[200px]"
                value={filters.banco}
                onChange={(e) => {
                  setFilters({ banco: e.target.value });
                }}
              />
              <SelectGrupoEconomico
                showAll
                value={filters.id_grupo_economico}
                onChange={(id_grupo_economico) => {
                  setFilters({ id_grupo_economico: id_grupo_economico });
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
