import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ReactNode } from "react";

export const ItemAccordionCaixa = ({
  value,
  title,
  children,
  className,
  qtde,
  valorTotal,
  icon: Icon,
  info: Info,
}: {
  value: string;
  title: string;
  children: ReactNode;
  className?: string;
  qtde: number;
  valorTotal?: number;
  icon: React.ElementType;
  info?: React.ElementType;
}) => {
  return (
    <Accordion
      type="single"
      collapsible
      className="px-2 py-1 border bg-slate-200 dark:bg-blue-950 rounded-lg"
    >
      <AccordionItem
        value={value}
        className="relative last:border-0 border-b border-slate-100 dark:border-blue-900 bg-slate-200 dark:bg-blue-950"
      >
        <AccordionTrigger className={`py-2 hover:no-underline`}>
          <span className="flex gap-2">
            <Icon />
            <h3 className="mr-2 text-sm sm:text-base text-left">
              {title} ({qtde})
            </h3>
            {Info && <Info />}
          </span>
        </AccordionTrigger>
        <AccordionContent
          className={`flex max-w-full gap-2 flex-nowrap ${className} rounded-md`}
        >
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
