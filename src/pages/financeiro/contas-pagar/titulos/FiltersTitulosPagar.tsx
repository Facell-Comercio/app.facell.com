import SelectFormaPagamento from "@/components/custom/SelectFormaPagamento";
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
import { useState } from "react";
import { useStoreTablePagar } from "./table/store-table";

const FiltersTitulosPagar = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTablePagar((state) => state.filters);
  const setFilters = useStoreTablePagar((state) => state.setFilters);
  const resetFilters = useStoreTablePagar((state) => state.resetFilters);

  const handleClickFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log(filters);

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
              <Input
                type="number"
                placeholder="ID"
                className="w-[80px]"
                value={filters?.id}
                onChange={(e) => {
                  setFilters({ id: e.target.value });
                }}
                min={0}
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
                  <SelectItem value="4">Pago Parcial</SelectItem>
                  <SelectItem value="5">Pago</SelectItem>
                </SelectContent>
              </Select>

              <SelectFormaPagamento
                className="flex-1 min-w-[20ch]"
                placeholder="Forma de pagamento"
                showAll
                value={filters.id_forma_pagamento}
                onChange={(e) => setFilters({ id_forma_pagamento: e })}
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
                value={filters?.filial}
                onChange={(e) => {
                  setFilters({ filial: e.target.value });
                }}
                placeholder="Nome Filial..."
              />
              <Input
                className="max-w-[200px]"
                value={filters?.nome_fornecedor}
                onChange={(e) =>
                  setFilters({ nome_fornecedor: e.target.value })
                }
                placeholder="Nome Fornecedor..."
              />
              <Input
                className="max-w-[200px]"
                value={filters.descricao}
                onChange={(e) => setFilters({ descricao: e.target.value })}
                placeholder="Descrição..."
              />

              <Input
                className="max-w-[200px]"
                value={filters?.nome_user}
                onChange={(e) => setFilters({ nome_user: e.target.value })}
                placeholder="Nome Usuário..."
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
