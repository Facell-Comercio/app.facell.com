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
import ModalFornecedores, { ItemFornecedor } from "@/pages/financeiro/components/ModalFornecedores";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import { useStoreTableModalRecebimentos } from "../store-table";

const FiltersVencimentos = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableModalRecebimentos((state) => state.filters_vencimentos);
  const setFilters = useStoreTableModalRecebimentos((state) => state.setFiltersVencimentos);
  const resetFilters = useStoreTableModalRecebimentos((state) => state.resetFiltersVencimentos);

  const handleClickFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // console.log(filters);

    refetch();
  };
  const handleResetFilter = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await new Promise((resolve) => resolve(resetFilters()));

    refetch();
  };

  function handleSelectionForncedor(fornecedor: ItemFornecedor) {
    setFilters({
      id_fornecedor: fornecedor.id,
      fornecedor: fornecedor.razao,
    });
  }

  const [itemOpen, setItemOpen] = useState<string>();
  const [modalFornecedoresIsOpen, setModalFornecedoresIsOpen] = useState(false);

  return (
    <Accordion
      type="single"
      collapsible
      value={itemOpen}
      onValueChange={(e) => setItemOpen(e)}
      className="p-2 border bg-background dark:border-slate-800 rounded-lg "
    >
      <AccordionItem value="item-1" className="relative border-0">
        <div className="flex gap-3 items-center absolute start-40 top-1">
          <Button size={"xs"} onClick={handleClickFilter}>
            Aplicar <FilterIcon size={12} className="ms-2" />
          </Button>
          <Button size={"xs"} variant="secondary" onClick={handleResetFilter}>
            Limpar <EraserIcon size={12} className="ms-2" />
          </Button>
        </div>

        <AccordionTrigger className={`py-1 hover:no-underline`}>
          <span className="">Filtros Vencimentos</span>
        </AccordionTrigger>

        <AccordionContent className="p-0 pt-3">
          <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-2">
            <div className="flex w-max space-x-3">
              <Input
                className="max-w-[200px]"
                value={filters.fornecedor}
                readOnly
                onClick={() => setModalFornecedoresIsOpen(true)}
                placeholder="Fornecedor"
              />
              <DatePickerWithRange
                date={filters.range_data_vencimentos}
                setDate={(date) => {
                  setFilters({
                    range_data_vencimentos: date,
                  });
                }}
              />
              <Input
                className="max-w-[200px]"
                value={filters.descricao_titulo}
                onChange={(e) =>
                  setFilters({
                    descricao_titulo: e.target.value,
                  })
                }
                placeholder="Descrição"
              />
              <Input
                className="max-w-[200px]"
                value={filters.num_doc}
                onChange={(e) =>
                  setFilters({
                    num_doc: e.target.value,
                  })
                }
                placeholder="Núm. Doc."
              />
              <ModalFornecedores
                open={modalFornecedoresIsOpen}
                handleSelection={handleSelectionForncedor}
                onOpenChange={() => setModalFornecedoresIsOpen(false)}
                closeOnSelection
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FiltersVencimentos;
