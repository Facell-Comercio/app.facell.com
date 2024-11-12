import { InputWithLabel } from "@/components/custom/FormInput";
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
import { useStoreTableVendasInvalidadas } from "./store-table";

const FiltersVendasInvalidadas = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableVendasInvalidadas((state) => state.filters);
  const setFilters = useStoreTableVendasInvalidadas((state) => state.setFilters);
  const resetFilters = useStoreTableVendasInvalidadas((state) => state.resetFilters);
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
            <div className="flex w-max space-x-3 p-1">
              <span className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Status</label>
                <Select
                  value={filters.status}
                  onValueChange={(status) => {
                    setFilters({
                      status: status,
                    });
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="em_analise">EM ANÁLISE</SelectItem>
                    <SelectItem value="procedente">PROCEDENTE</SelectItem>
                    <SelectItem value="improcedente">IMPROCEDENTE</SelectItem>
                    <SelectItem value="ciente">CIENTE</SelectItem>
                  </SelectContent>
                </Select>
              </span>
              <span className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Tipo</label>
                <Select
                  value={filters.tipo}
                  onValueChange={(tipo) => {
                    setFilters({
                      tipo: tipo,
                    });
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inadiplencia">INADIPLÊNCIA</SelectItem>
                    <SelectItem value="produto">PRODUTO</SelectItem>
                    <SelectItem value="servico">SERVIÇO</SelectItem>
                  </SelectContent>
                </Select>
              </span>
              <span className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Segmento</label>
                <Select
                  value={filters.segmento}
                  onValueChange={(segmento) => {
                    setFilters({
                      segmento: segmento,
                    });
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Segmento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="controle">CONTROLE</SelectItem>
                    <SelectItem value="aparelho">APARELHO</SelectItem>
                    <SelectItem value="pos_puro">PÓS PURO</SelectItem>
                  </SelectContent>
                </Select>
              </span>
              <InputWithLabel
                label="Motivo"
                value={filters.motivo || ""}
                onChange={(e) =>
                  setFilters({
                    motivo: e.target.value,
                  })
                }
                className="w-[180px]"
              />
              <InputWithLabel
                label="Termo"
                value={filters.termo || ""}
                onChange={(e) =>
                  setFilters({
                    termo: e.target.value,
                  })
                }
                className="w-[180px]"
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FiltersVendasInvalidadas;
