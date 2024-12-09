import { InputWithLabel } from "@/components/custom/FormInput";
import MultiSelectWithLabel from "@/components/custom/MultiSelectWithLabel";
import SelectMes from "@/components/custom/SelectMes";
import { AccordionItem } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionTrigger } from "@radix-ui/react-accordion";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import { useStoreTableVendasInvalidadas } from "./store-table";

type MultiSelectProps = {
  value: string;
  label: string;
};

export const status_list: MultiSelectProps[] = [
  {
    value: "em_analise",
    label: "EM ANÁLISE",
  },
  {
    value: "procedente",
    label: "PROCEDENTE",
  },
  {
    value: "improcedente",
    label: "IMPROCEDENTE",
  },
  {
    value: "ciente",
    label: "CIENTE",
  },
];

const tipo_list: MultiSelectProps[] = [
  {
    value: "INADIPLÊNCIA",
    label: "INADIPLÊNCIA",
  },
  {
    value: "PRODUTO",
    label: "PRODUTO",
  },
  {
    value: "SERVIÇO",
    label: "SERVIÇO",
  },
];

const segmento_list: MultiSelectProps[] = [
  {
    value: "controle",
    label: "CONTROLE",
  },
  {
    value: "aparelho",
    label: "APARELHO",
  },
  {
    value: "pos_puro",
    label: "PÓS PURO",
  },
];

const FiltersVendasInvalidadas = ({ refetch }: { refetch: () => void }) => {
  const filters = useStoreTableVendasInvalidadas((state) => state.filters);
  const setFilters = useStoreTableVendasInvalidadas((state) => state.setFilters);
  const resetFilters = useStoreTableVendasInvalidadas((state) => state.resetFilters);
  const [itemOpen, setItemOpen] = useState<string>("item-1");
  const [mes, setMes, ano, setAno] = useStoreTableVendasInvalidadas((state) => [
    state.mes,
    state.setMes,
    state.ano,
    state.setAno,
  ]);

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
              <span className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Mês Referência</label>
                <SelectMes value={mes} onValueChange={setMes} className="w-[180px]" />
              </span>
              <InputWithLabel
                label="Ano"
                value={ano || ""}
                onChange={(e) => setAno(e.target.value)}
                className="w-[12ch]"
                type="number"
                min={2023}
              />
              <MultiSelectWithLabel
                label="Status"
                options={status_list}
                onValueChange={(status_list) => {
                  setFilters({ status_list: status_list });
                }}
                defaultValue={filters.status_list || []}
                placeholder="Status"
                variant="secondary"
                animation={4}
                maxCount={2}
                divClassName="max-w-fit min-w-[20ch]"
                className={`bg-background hover:bg-background`}
              />
              <MultiSelectWithLabel
                label="Tipos"
                options={tipo_list}
                onValueChange={(tipo_list) => {
                  setFilters({ tipo_list: tipo_list });
                }}
                defaultValue={filters.tipo_list || []}
                placeholder="Tipo"
                variant="secondary"
                animation={4}
                maxCount={2}
                divClassName="max-w-fit min-w-[20ch]"
                className={`bg-background hover:bg-background`}
              />
              <MultiSelectWithLabel
                label="Segmentos"
                options={segmento_list}
                onValueChange={(segmento_list) => {
                  setFilters({ segmento_list: segmento_list });
                }}
                defaultValue={filters.segmento_list || []}
                placeholder="Segmento"
                variant="secondary"
                animation={4}
                maxCount={2}
                divClassName="max-w-fit min-w-[20ch]"
                className={`bg-background hover:bg-background`}
              />

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
