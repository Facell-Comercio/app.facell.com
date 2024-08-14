import {
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
  icon: Icon,
}: {
  value: string;
  title: string;
  children: ReactNode;
  className?: string;
  qtde: number;
  valorTotal: number;
  icon: React.ElementType;
}) => {
  return (
    <AccordionItem
      value={value}
      className="relative last:border-0 border-b border-slate-100 dark:border-blue-900 bg-slate-200 dark:bg-blue-950"
    >
      <AccordionTrigger className={`py-2 hover:no-underline`}>
        <span className="flex gap-1">
          <Icon />
          <h3 className="mr-2 text-sm sm:text-base text-left">
            {title} ({qtde})
          </h3>
        </span>
      </AccordionTrigger>
      <AccordionContent
        className={`flex max-w-full gap-2 flex-nowrap ${className}`}
      >
        {children}
      </AccordionContent>
    </AccordionItem>
  );
};
