import { SelectMultiFormaPagamento } from "@/components/custom/SelectFormaPagamento";
import { SelectMultiGrupoEconomico } from "@/components/custom/SelectGrupoEconomico";
import { SelectMultiStatus } from "@/components/custom/SelectMultiStatus";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range";
import { Input } from "@/components/ui/input";
import {
  ScrollArea,
  ScrollBar,
} from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EraserIcon,
  FilterIcon,
} from "lucide-react";
import { useState } from "react";
import { useStoreTableReceber } from "./store-table";

const FiltersTitulosReceber = ({
  refetch,
}: {
  refetch: () => void;
}) => {
  const filters = useStoreTableReceber(
    (state) => state.filters
  );
  const setFilters = useStoreTableReceber(
    (state) => state.setFilters
  );
  const resetFilters = useStoreTableReceber(
    (state) => state.resetFilters
  );

  const handleClickFilter = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    // console.log(filters);

    refetch();
  };
  const handleResetFilter = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    await new Promise((resolve) =>
      resolve(resetFilters())
    );

    refetch();
  };

  const [itemOpen, setItemOpen] =
    useState<string>("item-1");

  return (
    <Accordion
      type="single"
      collapsible
      value={itemOpen}
      onValueChange={(e) => setItemOpen(e)}
      className="p-2 border dark:border-slate-800 rounded-lg "
    >
      <AccordionItem
        value="item-1"
        className="relative border-0"
      >
        <div className="flex gap-3 items-center absolute start-16 top-1">
          <Button
            size={"xs"}
            onClick={handleClickFilter}
          >
            Aplicar{" "}
            <FilterIcon
              size={12}
              className="ms-2"
            />
          </Button>
          <Button
            size={"xs"}
            variant="secondary"
            onClick={handleResetFilter}
          >
            Limpar{" "}
            <EraserIcon
              size={12}
              className="ms-2"
            />
          </Button>
        </div>

        <AccordionTrigger
          className={`py-1 hover:no-underline`}
        >
          <span className="">Filtros</span>
        </AccordionTrigger>

        <AccordionContent className="p-0 pt-3">
          <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-4">
            <div className="flex w-max space-x-3">
              <Input
                type="number"
                placeholder="ID"
                className="w-[80px]"
                value={filters?.id}
                onChange={(e) => {
                  setFilters({
                    id: e.target.value,
                  });
                }}
                min={0}
              />
              <Input
                placeholder="DOC"
                className="w-[80px]"
                value={filters?.num_doc}
                onChange={(e) => {
                  setFilters({
                    num_doc: e.target.value,
                  });
                }}
              />

              <SelectMultiGrupoEconomico
                className="w-fit"
                value={
                  filters.grupo_economico_list ||
                  []
                }
                onChange={(value) => {
                  setFilters({
                    grupo_economico_list: value,
                  });
                }}
              />
              <SelectMultiFormaPagamento
                className="min-w-fit"
                value={
                  filters.forma_pagamento_list ||
                  []
                }
                onChange={(value) =>
                  setFilters({
                    forma_pagamento_list: value,
                  })
                }
              />

              <SelectMultiStatus
                className="w-fit"
                value={filters.status_list || []}
                onChange={(value) =>
                  setFilters({
                    status_list: value,
                  })
                }
              />

              <Select
                value={filters.tipo_data}
                onValueChange={(tipo_data) => {
                  setFilters({
                    tipo_data: tipo_data,
                  });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">
                    Criação
                  </SelectItem>
                  <SelectItem value="data_emissao">
                    Emissão
                  </SelectItem>
                  <SelectItem value="data_vencimento">
                    Vencimento
                  </SelectItem>
                  <SelectItem value="data_prevista">
                    Previsão
                  </SelectItem>
                  <SelectItem value="data_pagamento">
                    Pagamento
                  </SelectItem>
                </SelectContent>
              </Select>

              <DatePickerWithRange
                date={filters.range_data}
                setDate={(date) => {
                  setFilters({
                    range_data: date,
                  });
                }}
              />

              <Input
                className="max-w-[200px]"
                value={filters?.filial}
                onChange={(e) => {
                  setFilters({
                    filial: e.target.value,
                  });
                }}
                placeholder="Nome Filial..."
              />
              <Input
                className="max-w-[200px]"
                value={filters?.nome_fornecedor}
                onChange={(e) =>
                  setFilters({
                    nome_fornecedor:
                      e.target.value,
                  })
                }
                placeholder="Nome Fornecedor..."
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

              <Input
                className="max-w-[200px]"
                value={filters?.nome_user}
                onChange={(e) =>
                  setFilters({
                    nome_user: e.target.value,
                  })
                }
                placeholder="Nome Usuário..."
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FiltersTitulosReceber;
