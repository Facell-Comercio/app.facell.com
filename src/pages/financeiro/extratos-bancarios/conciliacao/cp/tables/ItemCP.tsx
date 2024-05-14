import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ReactNode } from "react";

export const ItemCP = ({
  value,
  title,
  children,
  className,
}: {
  value: string;
  title: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <AccordionItem
      value={value}
      className="relative last:border-0 border-b dark:border-slate-800"
    >
      <AccordionTrigger className={`py-1 hover:no-underline`}>
        <span className="">{title}</span>
      </AccordionTrigger>
      <AccordionContent
        className={`flex max-w-full gap-2 flex-nowrap ${className}`}
      >
        {children}
      </AccordionContent>
    </AccordionItem>
  );
};
