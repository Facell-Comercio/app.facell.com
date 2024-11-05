import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import DREGerencialRelatorio from "./dre-gerencial/DREGerencialRelatorio";

const DRERelatorios = () => {
  const [itemOpen, setItemOpen] = useState("");
  return (
    <Accordion type="single" collapsible className="p-2 border dark:border-slate-800 rounded-lg ">
      <AccordionItem value="item-1" className="relative border-0">
        <AccordionTrigger className={`py-1 hover:no-underline`}>DRE</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 p-0 pt-3">
          <DREGerencialRelatorio itemOpen={itemOpen} setItemOpen={setItemOpen} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DRERelatorios;
