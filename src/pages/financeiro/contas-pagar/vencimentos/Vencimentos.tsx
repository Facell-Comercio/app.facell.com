import { Accordion } from "@/components/ui/accordion";
import { useState } from "react";

import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useVencimentos } from "@/hooks/financeiro/useVencimentos";
import { Edit } from "lucide-react";
import ModalBordero from "../borderos/bordero/Modal";
import ModalAlteracoesVencimentosLote from "./components/ModalAlteracoesVencimentosLote";
import FiltersVencimentos from "./tables/FiltersVencimentos";
import { ItemVencimento } from "./tables/ItemVencimento";
import { columnsTableAPagar } from "./tables/columnsAPagar";
import { columnsTableEmBordero } from "./tables/columnsEmBordero";
import { columnsTablePagos } from "./tables/columnsPagos";
import { useStoreTableVencimentos } from "./tables/store";

const Vencimentos = () => {
  console.log("RENDER - Section Vencimentos");
  const [
    filters,
    rowSelection,
    handleRowSelection,
    idSelection,
    paginationAPagar,
    setPaginationAPagar,
    paginationEmBordero,
    setPaginationEmBordero,
    paginationPagos,
    setPaginationPagos,
    openModal,
  ] = useStoreTableVencimentos((state) => [
    state.filters,
    state.rowSelection,
    state.handleRowSelection,
    state.idSelection,
    state.paginationAPagar,
    state.setPaginationAPagar,
    state.paginationEmBordero,
    state.setPaginationEmBordero,
    state.paginationPagos,
    state.setPaginationPagos,
    state.openModal,
  ]);

  console.log(idSelection);

  const {
    data: dataVencimentosAPagar,
    refetch: refetchVencimentosAPagar,
    isLoading: isLoadingVencimentosAPagar,
  } = useVencimentos().getVencimentosAPagar({
    filters,
    pagination: paginationAPagar,
  });
  const {
    data: dataVencimentosEmBordero,
    refetch: refetchVencimentosEmBordero,
    isLoading: isLoadingVencimentosEmBordero,
  } = useVencimentos().getVencimentosEmBordero({
    filters,
    pagination: paginationEmBordero,
  });
  const {
    data: dataVencimentosPagos,
    refetch: refetchVencimentosPagos,
    isLoading: isLoadingVencimentosPagos,
  } = useVencimentos().getVencimentosPagos({
    filters,
    pagination: paginationPagos,
  });

  const vencimentosAPagar = dataVencimentosAPagar?.data?.rows || [];
  const rowCountVencimentosAPagar = dataVencimentosAPagar?.data?.rowCount || [];
  const valorTotalVencimentosAPagar =
    dataVencimentosAPagar?.data?.valorTotal || 0;

  const vencimentosEmBordero = dataVencimentosEmBordero?.data?.rows || [];
  const rowCountVencimentosEmBordero =
    dataVencimentosEmBordero?.data?.rowCount || [];
  const valorTotalVencimentosEmBordero =
    dataVencimentosEmBordero?.data?.valorTotal || 0;

  const vencimentosPagos = dataVencimentosPagos?.data?.rows || [];
  const rowCountVencimentosPagos = dataVencimentosPagos?.data?.rowCount || [];
  const valorTotalVencimentosPagos =
    dataVencimentosPagos?.data?.valorTotal || 0;

  function refetch() {
    refetchVencimentosAPagar();
    refetchVencimentosEmBordero();
    refetchVencimentosPagos();
    handleRowSelection({ idSelection: [], rowSelection: {} });
  }

  const [itemOpen, setItemOpen] = useState<string>("a-pagar");
  return (
    <div className="flex flex-col gap-3">
      <FiltersVencimentos refetch={refetch} />

      <Accordion
        type="single"
        collapsible
        value={itemOpen}
        onValueChange={(e) => setItemOpen(e)}
        className="px-2 py-1 border dark:border-slate-800 rounded-lg "
      >
        <ItemVencimento
          title="A Pagar"
          value="a-pagar"
          className="flex-col"
          qtde={rowCountVencimentosAPagar}
          valorTotal={valorTotalVencimentosAPagar}
        >
          <div className="flex justify-end">
            <Button
              variant={"outline"}
              size={"sm"}
              className="border border-orange-200 dark:border-orange-600"
              onClick={() => {
                if (!idSelection.length) {
                  toast({
                    title: "Vencimentos não selecionados",
                    description:
                      "Selecione no mínimo um vencimento para alterar",
                    duration: 3000,
                    variant: "warning",
                  });
                  return;
                }
                openModal();
              }}
            >
              <Edit className="me-2" size={16} /> Alterar em lote
            </Button>
          </div>
          <DataTable
            pagination={paginationAPagar}
            setPagination={setPaginationAPagar}
            rowSelection={rowSelection}
            handleRowSelection={handleRowSelection}
            data={vencimentosAPagar}
            rowCount={rowCountVencimentosAPagar}
            columns={columnsTableAPagar}
            isLoading={isLoadingVencimentosAPagar}
          />
        </ItemVencimento>
        <ItemVencimento
          title="Em Borderô"
          value="em-bordero"
          className="flex-col"
          qtde={rowCountVencimentosEmBordero}
          valorTotal={valorTotalVencimentosEmBordero}
        >
          <DataTable
            pagination={paginationEmBordero}
            setPagination={setPaginationEmBordero}
            data={vencimentosEmBordero}
            rowCount={rowCountVencimentosEmBordero}
            columns={columnsTableEmBordero}
            isLoading={isLoadingVencimentosEmBordero}
          />
        </ItemVencimento>
        <ItemVencimento
          title="Pagos"
          value="pagos"
          className="flex-col"
          qtde={rowCountVencimentosPagos}
          valorTotal={valorTotalVencimentosPagos}
        >
          <DataTable
            pagination={paginationPagos}
            setPagination={setPaginationPagos}
            data={vencimentosPagos}
            rowCount={rowCountVencimentosPagos}
            columns={columnsTablePagos}
            isLoading={isLoadingVencimentosPagos}
          />
        </ItemVencimento>
      </Accordion>
      <ModalBordero />
      <ModalAlteracoesVencimentosLote />
    </div>
  );
};

export default Vencimentos;