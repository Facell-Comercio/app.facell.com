import SelectFilial from "@/components/custom/SelectFilial";
import SelectGrupoEconomico from "@/components/custom/SelectGrupoEconomico";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
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
import { useStoreTableContasBancarias } from "./store-table";

const FiltersContasBancarias = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableContasBancarias((state) => state.filters);
  const setFilters = useStoreTableContasBancarias((state) => state.setFilters);
  const resetFilters = useStoreTableContasBancarias(
    (state) => state.resetFilters
  );

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
            <div className="flex w-max space-x-3">
              <Input
                placeholder="Descrição"
                className="max-w-[200px]"
                value={filters.descricao}
                onChange={(e) => {
                  setFilters({ descricao: e.target.value });
                }}
              />
              <Input
                placeholder="Banco"
                className="w-[80px]"
                value={filters.banco}
                onChange={(e) => {
                  setFilters({ banco: e.target.value });
                }}
              />
              <SelectFilial
                value={filters.id_filial}
                placeholder={"Selecione a filial"}
                onChange={(id_filial) => {
                  setFilters({ id_filial: id_filial });
                }}
              />
              <SelectGrupoEconomico
                value={filters.id_grupo_economico}
                onChange={(id_grupo_economico) => {
                  setFilters({ id_grupo_economico: id_grupo_economico });
                }}
              />
              <Select
                value={filters.id_tipo_conta}
                onValueChange={(tipo) => {
                  setFilters({ id_tipo_conta: tipo });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo Conta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Corrente</SelectItem>
                  <SelectItem value="2">Poupança</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.active}
                onValueChange={(ativo) => {
                  setFilters({ active: ativo });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Inativo</SelectItem>
                  <SelectItem value="1">Ativo</SelectItem>
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

export default FiltersContasBancarias;
