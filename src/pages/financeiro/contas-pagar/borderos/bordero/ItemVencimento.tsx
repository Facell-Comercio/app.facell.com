import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  qtde_selecionados,
  valor_selecionados,
}: {
  value: string;
  title: string;
  children: ReactNode;
  className?: string;
  qtde: number;
  valorTotal: number;
  qtde_selecionados?: number;
  valor_selecionados?: number;
}) => {
  return (
    <AccordionItem
      value={value}
      className="relative last:border-0 border-b border-slate-100 dark:border-blue-900 bg-slate-200 dark:bg-blue-950"
    >
      <AccordionTrigger className={`py-2 hover:no-underline`}>
        <span className="flex gap-1">
          <h3 className="mr-2 text-sm sm:text-base text-left">{title}</h3>
          <Badge variant={"info"} className="text-xs">
            Qtde: {qtde}
          </Badge>
          <Badge variant={"info"} className="text-xs">
            Valor Total: {normalizeCurrency(valorTotal)}
          </Badge>
          {qtde_selecionados && qtde_selecionados > 1 ? (
            <Badge variant={"info"} className="text-xs">
              {qtde_selecionados} Itens Selecionados: {normalizeCurrency(valor_selecionados)}
            </Badge>
          ) : null}
        </span>
      </AccordionTrigger>
      <AccordionContent className={`flex max-w-full gap-2 flex-nowrap ${className}`}>
        {children}
      </AccordionContent>
    </AccordionItem>
  );
};
