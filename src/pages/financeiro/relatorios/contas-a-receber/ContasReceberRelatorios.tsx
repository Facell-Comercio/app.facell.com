import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ContasReceberRelatorios = () => {
  // const [itemOpen, setItemOpen] = useState("");
  return (
    <Accordion type="single" collapsible className="p-2 border dark:border-slate-800 rounded-lg ">
      <AccordionItem value="item-1" className="relative border-0">
        <AccordionTrigger className={`py-1 hover:no-underline`}>Contas a Receber</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 p-0 pt-3"></AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ContasReceberRelatorios;
