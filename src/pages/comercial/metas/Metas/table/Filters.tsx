import { AccordionItem } from "@/components/ui/accordion";
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
import ModalFiliais from "@/pages/admin/components/ModalFiliais";
import { Filial } from "@/types/filial-type";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import { useStoreTableMetas } from "./store-table";

const FiltersMeta = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableMetas((state) => state.filters);
  const setFilters = useStoreTableMetas((state) => state.setFilters);
  const resetFilters = useStoreTableMetas((state) => state.resetFilters);
  const [itemOpen, setItemOpen] = useState<string>("item-1");
  const [modalFilialOpen, setModalFilialOpen] = useState<boolean>(false);
  const [filial, setFilial] = useState<string>("");

  const handleClickFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    refetch();
  };
  const handleResetFilter = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await new Promise((resolve) => resolve(resetFilters()));
    setFilial("");
    refetch();
  };
  function handleSelectFilial(filial: Filial) {
    setFilters({ id_filial: filial.id });
    setFilial(filial.nome);
  }

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
          <ScrollArea className="w-fill whitespace-nowrap rounded-md sm:pb-3">
            <div className="flex w-max space-x-3">
              <Input
                placeholder="Nome"
                className="max-w-[24ch]"
                value={filters.nome}
                onChange={(e) => {
                  setFilters({ nome: e.target.value });
                }}
              />
              <Select
                value={filters.id_grupo_economico}
                onValueChange={(id_grupo_economico) => {
                  setFilters({
                    id_grupo_economico: id_grupo_economico,
                    id_filial: "",
                  });
                  setFilial("");
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Grupo Econômico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">FACELL</SelectItem>
                  <SelectItem value="9">FORTTELECOM</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Filial"
                className="w-[30ch]"
                readOnly
                value={filial}
                onClick={() => setModalFilialOpen(true)}
              />
              <Input
                placeholder="Cargo"
                className="max-w-[200px]"
                value={filters.cargo}
                onChange={(e) => {
                  setFilters({ cargo: e.target.value });
                }}
              />
              <Input
                placeholder="CPF"
                className="max-w-[200px]"
                value={filters.cpf}
                onChange={(e) => {
                  setFilters({ cpf: e.target.value });
                }}
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
      <ModalFiliais
        open={modalFilialOpen}
        handleSelection={handleSelectFilial}
        onOpenChange={setModalFilialOpen}
        closeOnSelection
        id_grupo_economico={filters?.id_grupo_economico}
      />
    </Accordion>
  );
};

export default FiltersMeta;
