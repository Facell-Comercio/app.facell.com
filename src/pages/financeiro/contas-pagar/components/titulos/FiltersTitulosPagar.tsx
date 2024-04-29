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
import { EraserIcon, FilterIcon } from "lucide-react";
import { useStoreTablePagar } from "./table/store-table";

const FiltersTitulosPagar = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTablePagar((state) => state.filters);
  const setFilters = useStoreTablePagar((state) => state.setFilters);
  const resetFilters = useStoreTablePagar((state) => state.resetFilters);

  const handleClickFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    refetch();
  };
  const handleResetFilter = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
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
        <AccordionTrigger className={`py-1 hover:no-underline`}>
          <div className="flex gap-3 items-center">
            <span>Filtros</span>
            <Button size={"xs"} onClick={handleClickFilter}>
              Aplicar <FilterIcon size={12} className="ms-2" />
            </Button>
            <Button size={"xs"} variant="secondary" onClick={handleResetFilter}>
              Limpar <EraserIcon size={12} className="ms-2" />
            </Button>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-0 pt-3">
          <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-4">
            <div className="flex w-max space-x-4">
              <Input
                type="number"
                placeholder="ID"
                className="w-[80px]"
                value={filters?.id}
                onChange={(e) => {
                  setFilters({ id: e.target.value });
                }}
              />

              <SelectGrupoEconomico
                showAll={true}
                value={filters.id_grupo_economico}
                onChange={(id_grupo_economico) => {
                  setFilters({ id_grupo_economico: id_grupo_economico });
                }}
              />

              <Select
                value={filters.id_status}
                onValueChange={(id_status) => {
                  setFilters({ id_status: id_status });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="1">Solicitado</SelectItem>
                  <SelectItem value="2">Negado</SelectItem>
                  <SelectItem value="3">Aprovado</SelectItem>
                  <SelectItem value="4">Pago</SelectItem>
                  <SelectItem value="5">Cancelado</SelectItem>
                </SelectContent>
              </Select>

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

export default FiltersTitulosPagar;
