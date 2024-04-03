import SelectFilial from "@/components/custom/SelectFilial";
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
import { useStoreTableEquipamentos } from "./store-table";

const FiltersEquipamentos = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableEquipamentos((state) => state.filters);
  const setFilters = useStoreTableEquipamentos((state) => state.setFilters);
  const resetFilters = useStoreTableEquipamentos((state) => state.resetFilters);

  const handleClickFilter = () => refetch();
  const handleResetFilter = async () => {
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
        <AccordionTrigger className="py-1 hover:no-underline">
          Filtros
        </AccordionTrigger>
        <AccordionContent className="p-0">
          <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-4">
            <div className="flex w-max space-x-4">
              <Button onClick={handleClickFilter}>
                Filtrar <FilterIcon size={12} className="ms-2" />
              </Button>
              <Button onClick={handleResetFilter} variant="destructive">
                Limpar <EraserIcon size={12} className="ms-2" />
              </Button>

              <SelectFilial
                value={filters.id_filial}
                placeholder={"Selecione a filial"}
                onChange={(id_filial) => {
                  setFilters({ id_filial: id_filial });
                }}
              />
              <Input
                placeholder="Estabelecimento"
                className="max-w-[200px]"
                value={filters.estabelecimento}
                onChange={(e) => {
                  setFilters({ estabelecimento: e.target.value });
                }}
              />
              <Input
                placeholder="Numéro Máquina"
                className="max-w-[200px]"
                value={filters.num_maquina}
                onChange={(e) => {
                  setFilters({ num_maquina: e.target.value });
                }}
              />
              <Select
                value={filters.active}
                onValueChange={(active) => {
                  setFilters({ active: active });
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

export default FiltersEquipamentos;
