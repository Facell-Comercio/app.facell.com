import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { normalizeCurrency } from "@/helpers/mask";
import { ReactNode } from "react";

export const ItemVencimento = ({
  value,
  title,
  children,
  className,
  qtde,
  valorTotal,
}: {
  value: string;
  title: string;
  children: ReactNode;
  className?: string;
  qtde: number;
  valorTotal: number;
}) => {
  return (
    <AccordionItem
      value={value}
      className="relative last:border-0 border-b bg-background"
    >
      <AccordionTrigger className={`py-2 hover:no-underline`}>
        <span className="flex gap-1">
          <h3 className="mr-2">{title}</h3>
          <Badge variant={"secondary"}>Qtde: {qtde}</Badge>
          <Badge variant={"secondary"}>
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
