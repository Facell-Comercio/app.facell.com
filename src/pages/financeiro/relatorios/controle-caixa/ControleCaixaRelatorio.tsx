import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import ModeloRelatorio from "./ModeloRelatorio";

const ControleCaixaRelatorios = () => {
  const [itemOpen, setItemOpen] = useState("");
  return (
    <Accordion type="single" collapsible className="p-2 border dark:border-slate-800 rounded-lg ">
      <AccordionItem value="item-1" className="relative border-0">
        <AccordionTrigger className={`py-1 hover:no-underline`}>Controle de Caixa</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 p-0 pt-3">
          <ModeloRelatorio
            itemOpen={itemOpen}
            setItemOpen={setItemOpen}
            title="Relatório Datasys x Adquirente"
            nomeLayout={"exportLayoutCartoes"}
          />
          <ModeloRelatorio
            itemOpen={itemOpen}
            setItemOpen={setItemOpen}
            title="Relatório Recarga (Datasys x RV Cellcard)"
            nomeLayout={"exportLayoutRV"}
          />
          <ModeloRelatorio
            itemOpen={itemOpen}
            setItemOpen={setItemOpen}
            title="Relatório Datasys x Pitzi"
            nomeLayout={"exportLayoutPitzi"}
          />
          <ModeloRelatorio
            itemOpen={itemOpen}
            setItemOpen={setItemOpen}
            title="Relatório PIX Datasys x Banco"
            nomeLayout={"exportLayoutPIX"}
          />
          <ModeloRelatorio
            itemOpen={itemOpen}
            setItemOpen={setItemOpen}
            title="Relatório Tradein Datasys x RENOV"
            nomeLayout={"exportLayoutTradein"}
          />
          <ModeloRelatorio
            itemOpen={itemOpen}
            setItemOpen={setItemOpen}
            title="Relatório Crediário Datasys x PayJoy"
            nomeLayout={"exportLayoutCrediario"}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ControleCaixaRelatorios;
