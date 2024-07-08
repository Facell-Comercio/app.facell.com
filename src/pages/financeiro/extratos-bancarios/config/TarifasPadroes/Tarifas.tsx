import { DataTable } from "@/components/custom/DataTable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTarifas } from "@/hooks/financeiro/useTarifas";
import { EraserIcon, FilterIcon, Plus } from "lucide-react";
import { useState } from "react";
import ModalContasBancarias from "../../../components/ModalContasBancarias";
import { ContaBancaria } from "../../extrato/components/context";
import ModalTarifas from "./form/Modal";
import { columnsTable } from "./table/columns";
import { useStoreTableTarifas } from "./table/store-table";

const TarifasPadroes = () => {
  const [filters, setFilters] = useState({
    id_matriz: "",
  });
  const [pagination, setPagination, openModal] = useStoreTableTarifas(
    (state) => [state.pagination, state.setPagination, state.openModal]
  );
  const { data, isLoading, refetch } = useTarifas().getAll({
    pagination,
    filters,
  });
  const rows = data?.data?.rows || [];
  const rowCount = data?.data?.rowCount || 0;

  const [modalContasOpen, setModalContasOpen] = useState<boolean>(false);
  const [contaBancaria, setContaBancaria] = useState<ContaBancaria | null>(
    null
  );

  const toggleModalContasBancarias = () => {
    setModalContasOpen((prev) => !prev);
  };
  const handleSelectionConta = (conta: ContaBancaria) => {
    setContaBancaria(conta);
  };

  return (
    <Accordion type="single" collapsible className="mt-3">
      <AccordionItem value="item-1">
        <AccordionTrigger className="p-2 hover:no-underline">
          Tarifas Padrão
        </AccordionTrigger>
        <AccordionContent className="p-2">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-5 items-end justify-between">
              <div className="flex flex-wrap gap-3 items-end">
                <div>
                  <span className="text-gray-500 text-sm font-medium">
                    Banco
                  </span>
                  <Input
                    className="min-w-[30ch] flex-1"
                    readOnly={true}
                    placeholder="SELECIONE A CONTA BANCÁRIA"
                    onClick={toggleModalContasBancarias}
                    value={contaBancaria?.banco || ""}
                  />
                </div>
                <div>
                  <span className="text-gray-500 text-sm font-medium">
                    Conta bancária
                  </span>
                  <Input
                    className="min-w-[30ch] flex-1"
                    readOnly={true}
                    placeholder="SELECIONE A CONTA BANCÁRIA"
                    onClick={toggleModalContasBancarias}
                    value={contaBancaria?.descricao || ""}
                  />
                </div>
                <Button
                  onClick={() => {
                    setFilters({
                      id_matriz: contaBancaria?.id_matriz || "",
                    });
                    refetch();
                  }}
                >
                  <FilterIcon size={18} className="me-2" /> Filtrar
                </Button>
                <Button
                  variant={"secondary"}
                  onClick={() => {
                    setFilters({
                      id_matriz: "",
                    });
                    setContaBancaria(null);
                    refetch();
                  }}
                >
                  <EraserIcon size={18} className="me-2" /> Limpar Filtro
                </Button>
              </div>
              <Button
                variant={"tertiary"}
                className="border-blue-200 dark:border-primary"
                onClick={() => openModal("")}
              >
                <Plus className="me-2" size={18} /> Nova Tarifa
              </Button>
              <ModalContasBancarias
                //@ts-ignore
                handleSelection={handleSelectionConta}
                onOpenChange={toggleModalContasBancarias}
                closeOnSelection={true}
                open={modalContasOpen}
              />
            </div>

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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default TarifasPadroes;
