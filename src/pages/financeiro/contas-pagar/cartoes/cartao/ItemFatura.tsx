import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { normalizeCurrency } from "@/helpers/mask";
import { ReactNode } from "react";

export const ItemFatura = ({
  value,
  title,
  children,
  className,
  qtde,
  valorTotal,
  icon: Icon,
}: {
  value: string;
  title: string;
  children: ReactNode;
  className?: string;
  qtde: number;
  valorTotal: number;
  icon?: React.ElementType;
}) => {
  return (
    <AccordionItem
      value={value}
      className="relative last:border-0 border-b border-slate-100 dark:border-blue-900 bg-slate-200 dark:bg-blue-950"
    >
      <AccordionTrigger className={`py-2 hover:no-underline`}>
        <span className="flex gap-1">
          <h3 className="flex gap-3 mr-2 text-sm sm:text-base text-left">
            {Icon && <Icon />}
            {title}
          </h3>
          <Badge variant={"info"} className="text-xs">
            Qtde: {qtde}
          </Badge>
          <Badge variant={"info"} className="text-xs">
            Valor Total: {normalizeCurrency(valorTotal)}
          </Badge>
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
