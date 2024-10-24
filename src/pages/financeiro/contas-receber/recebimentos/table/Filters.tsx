import { SelectMultiFilial } from "@/components/custom/SelectFilial";
import SelectMatriz from "@/components/custom/SelectMatriz";
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
import ModalContasBancarias, {
  ItemContaBancariaProps,
} from "@/pages/financeiro/components/ModalContasBancarias";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import { useStoreTableRecebimentos } from "./store-table";

const FiltersRecebimentos = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableRecebimentos((state) => state.filters);
  const setFilters = useStoreTableRecebimentos((state) => state.setFilters);
  const resetFilters = useStoreTableRecebimentos((state) => state.resetFilters);
  const [modalContaBancariaOpen, setModalContaBancariaOpen] = useState<boolean>(false);

  const handleClickFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    refetch();
  };
  const handleResetFilter = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await new Promise((resolve) => resolve(resetFilters()));
    refetch();
  };

  function handleSelectionContaBancaria(item: ItemContaBancariaProps) {
    setFilters({
      id_conta_bancaria: item.id,
    });
    setModalContaBancariaOpen(false);
  }

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
                placeholder="ID TÍTULO"
                className="w-[20ch]"
                value={filters?.id_titulo}
                onChange={(e) => {
                  setFilters({
                    id_titulo: e.target.value,
                  });
                }}
                min={0}
              />

              <Input
                type="number"
                placeholder="ID VENCIMENTO"
                className="w-[20ch]"
                value={filters?.id_vencimento}
                onChange={(e) => {
                  setFilters({
                    id_vencimento: e.target.value,
                  });
                }}
                min={0}
              />

              <SelectMatriz
                showAll={true}
                value={filters.id_matriz}
                onChange={(id_matriz) => {
                  setFilters({
                    id_matriz: id_matriz,
                  });
                }}
              />
              <SelectMultiFilial
                className="min-w-fit"
                id_matriz={filters.id_matriz || ""}
                value={filters.filiais_list || []}
                onChange={(value) =>
                  setFilters({
                    filiais_list: value,
                  })
                }
              />

              <Input
                className="max-w-[200px]"
                value={filters.fornecedor}
                onChange={(e) =>
                  setFilters({
                    fornecedor: e.target.value,
                  })
                }
                placeholder="Descrição..."
              />
              <Input
                className="max-w-[200px]"
                value={filters.descricao}
                onChange={(e) =>
                  setFilters({
                    descricao: e.target.value,
                  })
                }
                placeholder="Descrição..."
              />
              <DatePickerWithRange
                date={filters.range_data}
                setDate={(date) => {
                  setFilters({
                    range_data: date,
                  });
                }}
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <ModalContasBancarias
            open={modalContaBancariaOpen}
            handleSelection={handleSelectionContaBancaria}
            onOpenChange={() => setModalContaBancariaOpen((prev) => !prev)}
            id_matriz={filters.id_matriz || ""}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FiltersRecebimentos;
