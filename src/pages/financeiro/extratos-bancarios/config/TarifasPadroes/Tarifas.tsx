import { DataTable } from "@/components/custom/DataTable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useTarifas } from "@/hooks/financeiro/useTarifas";
import { Plus } from "lucide-react";
import { useExtratosStore } from "../../context";
import ModalTarifas from "./form/Modal";
import { columnsTable } from "./table/columns";
import { useStoreTableTarifas } from "./table/store-table";

const TarifasPadroes = () => {
  const [pagination, setPagination, openModal] =
    useStoreTableTarifas((state) => [
      state.pagination,
      state.setPagination,
      state.openModal,
    ]);
  const [contaBancaria] = useExtratosStore(
    (state) => [state.contaBancaria]
  );

  const { data, isLoading } = useTarifas().getAll(
    {
      pagination,
      filters: {
        id_matriz: contaBancaria?.id_matriz,
      },
    }
  );
  const rows = data?.data?.rows || [];
  const rowCount = data?.data?.rowCount || 0;

  return (
    <Accordion
      type="single"
      collapsible
      className="mt-3"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="p-2 hover:no-underline">
          Tarifas Padrão
        </AccordionTrigger>
        <AccordionContent className="p-2">
          {contaBancaria && (
            <div className="flex flex-col gap-3">
              <span className="flex justify-end">
                <Button
                  variant={"tertiary"}
                  className="border-blue-200 dark:border-primary w-fit"
                  onClick={() => openModal("")}
                >
                  <Plus
                    className="me-2"
                    size={18}
                  />
                  Nova Tarifa
                </Button>
              </span>
              <DataTable
                pagination={pagination}
                setPagination={setPagination}
                data={rows}
                rowCount={rowCount}
                columns={columnsTable}
                isLoading={isLoading}
              />
              <ModalTarifas />
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default TarifasPadroes;
