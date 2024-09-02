import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useExtratosStore } from "../../context";
import FormNovoPadrao from "./form/Form";
import TablePadroes from "./table/TablePadroes";

const TransacoesNaoConciliaveis = () => {
  const [contaBancaria] = useExtratosStore(
    (state) => [state.contaBancaria]
  );

  return (
    <Accordion
      type="single"
      collapsible
      className=" mt-3"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="p-2 hover:no-underline">
          Transações não conciliáveis - Padrões
        </AccordionTrigger>
        <AccordionContent className="p-2">
          <div className="flex flex-col gap-3">
            {contaBancaria && (
              <>
                <span className="flex justify-end w-full">
                  <FormNovoPadrao
                    conta={contaBancaria}
                  />
                </span>
                <div>
                  <TablePadroes
                    conta={contaBancaria}
                  />
                </div>
              </>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default TransacoesNaoConciliaveis;
