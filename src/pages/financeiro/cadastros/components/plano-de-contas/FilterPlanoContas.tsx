import SelectGrupoEconomico from "@/components/custom/SelectGrupoEconomico";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useStoreTablePlanoContas } from "./table-plano-contas/store-table";

const FiltersPlanoContas = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTablePlanoContas(state => state.filters)
  const setFilters = useStoreTablePlanoContas(state => state.setFilters)
  const resetFilters = useStoreTablePlanoContas(state => state.resetFilters)

  const handleClickFilter = () => refetch()
  const handleResetFilter = async () => {
    await new Promise(resolve => resolve(resetFilters()))
    refetch()
  }

  return (
    <Accordion type="single" collapsible className="p-2 border-2 dark:border-slate-800 rounded-lg ">
      <AccordionItem value="item-1" className="border-0">
        <AccordionTrigger className="py-1 hover:no-underline">Filtros</AccordionTrigger>
        <AccordionContent className="p-0">
          <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-4">
            <div className="flex w-max space-x-4">
              <Button onClick={handleClickFilter}>
                Filtrar <FilterIcon size={12} className="ms-2" />
              </Button>
              <Button onClick={handleResetFilter} variant="destructive">
                Limpar <EraserIcon size={12} className="ms-2" />
              </Button>

              <Input
                placeholder="Código"
                className="w-[80px]"
                value={filters.codigo}
                onChange={(e) => {
                  setFilters({ codigo: e.target.value });
                }}
              />
              <Input
                placeholder="Descrição"
                className="max-w-[200px]"
                value={filters.nivel}
                onChange={(e) => {
                  setFilters({ nivel: e.target.value });
                }}
              />
              <Select
                value={filters.tipo}
                onValueChange={(tipo) => {
                  setFilters({ tipo: tipo });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Receita">Receita</SelectItem>
                  <SelectItem value="Despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
              <SelectGrupoEconomico
                showAll
                value={filters.id_grupo_economico}
                onChange={(id_grupo_economico) => {
                  setFilters({ id_grupo_economico: id_grupo_economico });
                }}
              />
              <Select
                value={filters.ativo}
                onValueChange={(ativo) => {
                  setFilters({ ativo: ativo });
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

export default FiltersPlanoContas;
