import { Input } from "@/components/custom/FormInput";
import SelectMes from "@/components/custom/SelectMes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useMailing } from "@/hooks/marketing/useMailing";
import { useState } from "react";
import { useStoreCampanhas } from "./store";

const Campanhas = () => {
  const [openModal, filters, setFilters] = useStoreCampanhas((state) => [
    state.openModal,
    state.filters,
    state.setFilters,
  ]);
  const { data, refetch, isLoading, isSuccess } = useMailing().getCampanhas({
    filters,
  });
  const [itemOpen, setItemOpen] = useState<string>("item-1");

  return (
    <div className="flex flex-col gap-3 ">
      <span className="flex gap-3">
        <SelectMes value={filters.mes} onValueChange={(mes) => setFilters({ mes })} />
        <Input
          type="number"
          min={2023}
          max={new Date().getFullYear() + 1}
          value={filters.ano}
          onChange={(e) => setFilters({ ano: e.target.value })}
        />
      </span>
      {isLoading ? (
        <section className="flex max-w-full gap-2 h-[80vh] max-h-full">
          <Skeleton className="w-full h-full" />
        </section>
      ) : (
        <>
          {data &&
            data.map((campanha: any) => (
              <Accordion
                type="single"
                collapsible
                value={itemOpen}
                onValueChange={(e) => setItemOpen(e)}
                className="border rounded-md"
                key={`campanha-${campanha.id}-${campanha.nome}`}
              >
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger className="p-3 border-0 rounded-md py-1 hover:no-underline">
                    {campanha.nome}
                  </AccordionTrigger>
                  <AccordionContent className="flex gap-2 flex-col p-2"></AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
        </>
      )}
    </div>
  );
};

export default Campanhas;
