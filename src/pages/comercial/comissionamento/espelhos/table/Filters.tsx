import { Input } from "@/components/custom/FormInput";
import SelectMes from "@/components/custom/SelectMes";
import { AccordionItem } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionTrigger } from "@radix-ui/react-accordion";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import { useStoreTableEspelhos } from "./store-table";

const FiltersEspelhos = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableEspelhos((state) => state.filters);
  const setFilters = useStoreTableEspelhos((state) => state.setFilters);
  const resetFilters = useStoreTableEspelhos((state) => state.resetFilters);
  const [itemOpen, setItemOpen] = useState<string>("item-1");

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
          <span className="font-medium">Filtros</span>
        </AccordionTrigger>
        <AccordionContent className="p-0 pt-3">
          <ScrollArea className="w-fill whitespace-nowrap rounded-md sm:pb-3">
            <div className="flex w-max space-x-3">
              <span className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Grupo Econômico</label>
                <Select
                  value={filters.id_grupo_economico}
                  onValueChange={(id_grupo_economico) => {
                    setFilters({
                      id_grupo_economico: id_grupo_economico,
                    });
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione o Grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">FACELL</SelectItem>
                    <SelectItem value="9">FORTTELECOM</SelectItem>
                  </SelectContent>
                </Select>
              </span>
              <span className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Mês Folha</label>
                <SelectMes
                  value={filters.mes}
                  onValueChange={(mes) => setFilters({ mes: mes })}
                  className="w-[180px]"
                />
              </span>
              <span className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Ano</label>
                <Input
                  value={filters.ano}
                  onChange={(e) =>
                    setFilters({
                      ano: e.target.value,
                    })
                  }
                  className="w-[12ch]"
                  type="number"
                  min={2023}
                />
              </span>

              <span className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Tipo de Meta</label>
                <Select
                  value={filters.tipo_meta}
                  onValueChange={(tipo_meta) => {
                    setFilters({
                      tipo_meta: tipo_meta,
                    });
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">TODAS</SelectItem>
                    <SelectItem value="consultor">CONSULTOR</SelectItem>
                    <SelectItem value="agregador">AGREGADOR</SelectItem>
                  </SelectContent>
                </Select>
              </span>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FiltersEspelhos;
