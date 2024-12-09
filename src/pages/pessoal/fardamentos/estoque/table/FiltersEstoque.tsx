import { AccordionItem } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionTrigger,
  } from "@radix-ui/react-accordion";
import { useStoreEstoque} from "./store-table";
import { EraserIcon, FilterIcon, Target } from "lucide-react";

const FiltersEstoque = ({refetch}: {refetch: () => void}) => {

        const filters =  useStoreEstoque((state) => state.filters);
        const setFilters = useStoreEstoque((state) => state.setFilters);
        const resetFilters = useStoreEstoque((state) => state.resetFilters)
        const [itemOpen, setItemOpen] = useState<string>("item-1");


        const handleClickFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            refetch();
        }
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
          onValueChange={(e)=> setItemOpen(e)}
          className="p-2 border-2 dark:border-slate-800 rounded-lg mb-2"
        >
          <AccordionItem value="item-1" className="relative border-0 ">
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
              <ScrollArea className=" w-full whitespace-nowrap rounded-md sm:pb-3">
                <div className="flex w-max space-x-3">
                  <Select
                  value={filters.id_grupo_economico}
                  onValueChange={(id_grupo_economico) => {
                    setFilters({
                      id_grupo_economico: id_grupo_economico
                    });
                  }}
                  >
                    <SelectTrigger className="max-w-[24ch]">
                      <SelectValue placeholder="Grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">FACELL</SelectItem>
                      <SelectItem value="3">AM EMPREENDIMENTOS</SelectItem>
                      <SelectItem value="4">FLOR DE LIZ</SelectItem>
                      <SelectItem value="5">MRH</SelectItem>
                      <SelectItem value="6">POMPEIA</SelectItem>
                      <SelectItem value="7">JARDINS HELENA</SelectItem>
                      <SelectItem value="8">DÍON</SelectItem>
                      <SelectItem value="9">FORT</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="UF"
                    className="w-[6ch]"
                    value={filters.uf}
                    onChange={(e) => {
                        setFilters({uf: e.target.value});
                    }}
                  />
                  <Input
                    placeholder="Modelo"
                    className="max-w-[200ch]"
                    value={filters.modelo}
                    onChange={(e) => {
                        setFilters({modelo: e.target.value})
                    }}
                  />
                  <Input placeholder="Tamanho" className="w-[11ch]" />
                  <Select
                  value={filters.sexo}
                  onValueChange={(sexo) => {
                    setFilters({
                      sexo: sexo
                    });
                  }}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">M</SelectItem>
                      <SelectItem value="F">F</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
    )
};

export default FiltersEstoque;
