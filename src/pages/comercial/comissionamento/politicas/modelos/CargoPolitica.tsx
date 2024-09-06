import AlertPopUp from "@/components/custom/AlertPopUp";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { usePoliticas } from "@/hooks/comercial/usePoliticas";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useStoreComissionamentoPoliticas } from "../store";
import Modelo, {
  ModeloPoliticaProps,
} from "./Modelo";

type EscalaonamentoItemProps = {
  id?: string;
  percentual?: number;
};
export interface CargoProps {
  id?: string;
  nome?: string;
  id_escalonamento?: string;
  escalonamento?: string;
  escalonamento_itens?: EscalaonamentoItemProps[];
  modelos?: ModeloPoliticaProps[];
}

const CargoPolitica = ({
  className,
  data,
}: {
  data: CargoProps;
  className?: string;
}) => {
  const [openModalModelo] =
    useStoreComissionamentoPoliticas((state) => [
      state.openModalModelo,
    ]);
  const [itemOpen, setItemOpen] = useState("");
  const { mutate: removeCargoPolitica } =
    usePoliticas().removeCargoPolitica();
  return (
    <Accordion
      type="single"
      collapsible
      value={itemOpen}
      onValueChange={(e) => setItemOpen(e)}
      className="px-2 py-1 border bg-background rounded-lg "
    >
      <AccordionItem
        value={
          data?.nome
            ?.toLowerCase()
            .replaceAll(" ", "_") || ""
        }
        className="relative last:border-0 border-b border-slate-100 dark:border-blue-900 bg-background"
      >
        <AccordionTrigger
          className={`py-2 hover:no-underline`}
        >
          <h3 className="mr-2 text-sm sm:text-base font-semibold text-left capitalize">
            {String(
              data.nome || ""
            ).toLowerCase()}
          </h3>
        </AccordionTrigger>
        <AccordionContent
          className={`flex flex-col justify-end max-w-full gap-2 flex-nowrap ${className}`}
        >
          <div className="flex gap-2 justify-end justify-self-end">
            <AlertPopUp
              title={"Deseja realmente remover"}
              description="Essa ação não pode ser desfeita. O cargo será definitivamente removido desta política."
              action={() => {
                removeCargoPolitica(data.id);
              }}
            >
              <Button
                variant={"destructive"}
                size={"sm"}
              >
                <Minus
                  size={18}
                  className="me-2"
                />
                Remover Cargo
              </Button>
            </AlertPopUp>
            <Button
              size={"sm"}
              onClick={() =>
                openModalModelo({
                  id: "",
                  id_cargo_politica: data.id,
                })
              }
            >
              <Plus size={18} className="me-2" />
              Add Modelo
            </Button>
          </div>
          {data?.modelos?.map((modelo, index) => (
            <Modelo
              data={modelo}
              key={`${index} ${modelo.id_modelo}`}
              escalonamentoCargo={{
                descricao:
                  data.escalonamento || "",
                itens:
                  data.escalonamento_itens?.map(
                    (item) =>
                      String(item.percentual)
                  ) || [],
              }}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
export default CargoPolitica;
