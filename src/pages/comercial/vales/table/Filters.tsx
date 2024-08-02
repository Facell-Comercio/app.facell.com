import { AccordionItem } from "@/components/ui/accordion";
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
import ModalFiliais from "@/pages/admin/components/ModalFiliais";
import { Filial } from "@/types/filial-type";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import { useStoreTableVale } from "./store-table";

const FiltersVale = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableVale((state) => state.filters);
  const setFilters = useStoreTableVale((state) => state.setFilters);
  const resetFilters = useStoreTableVale((state) => state.resetFilters);

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
  const [modalFilialOpen, setModalFilialOpen] = useState<boolean>(false);
  const [filial, setFilial] = useState<string>("");
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
          <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-2 lg:pb-0">
            <div className="flex w-max space-x-3">
              <Input
                placeholder="Colaborador"
                className="max-w-[24ch]"
                value={filters.colaborador}
                onChange={(e) => {
                  setFilters({ colaborador: e.target.value });
                }}
              />
              <Input
                placeholder="Filial"
                className="w-[30ch]"
                readOnly
                value={filial}
                onClick={() => setModalFilialOpen(true)}
              />

              <Input
                placeholder="Origem"
                className="max-w-[200px]"
                value={filters.origem}
                onChange={(e) => {
                  setFilters({ origem: e.target.value });
                }}
              />
              {/* <Input
                placeholder="Observação"
                className="max-w-[200px]"
                value={filters.obs}
                onChange={(e) => {
                  setFilters({ obs: e.target.value });
                }}
              /> */}
              <Select
                value={filters.tipo_data}
                onValueChange={(tipo_data) => {
                  setFilters({ tipo_data: tipo_data });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de Data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Criação</SelectItem>
                  <SelectItem value="updated_at">Atualização</SelectItem>
                  <SelectItem value="data_inicio_cobranca">
                    Início de Cobrança
                  </SelectItem>
                </SelectContent>
              </Select>
              <DatePickerWithRange
                date={filters.range_data}
                setDate={(date) => {
                  setFilters({ range_data: date });
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
      />
    </Accordion>
  );
};

export default FiltersVale;
