import { DataTable } from "@/components/custom/DataTable";
import { useTituloReceber } from "@/hooks/financeiro/useTituloReceber";
import ModalTituloReceber from "../titulos/titulo/ModalTituloReceber";
import ButtonExportRecebimentos from "./components/ButtonExportarRecebimentos";
import ButtonNovoRecebimentoBancario from "./components/ButtonNovoRecebimentoBancaria";
import ButtonNovoRecebimentoManual from "./components/ButtonNovoRecebimentoManual";
import { ModalRecebimentoBancario } from "./modais/ModalRecebimentoBancario";
import { ModalRecebimentoManual } from "./modais/ModalRecebimentoManual";
import { columnsTable } from "./table/columns";
import FiltersRecebimentos from "./table/Filters";
import { useStoreTableRecebimentos } from "./table/store-table";

export const Recebimentos = () => {
  const [pagination, setPagination, filters, rowSelection, handleRowSelection] =
    useStoreTableRecebimentos((state) => [
      state.pagination,
      state.setPagination,
      state.filters,

      state.rowSelection,
      state.handleRowSelection,
    ]);

  const { data, refetch, isLoading } = useTituloReceber().getAllRecebimentos({
    pagination,
    filters,
  });

  const rows = data?.rows || [];
  const rowCount = data?.rowCount || 0;

  function refetchTitulos() {
    refetch();
    handleRowSelection({ idSelection: [], rowSelection: {} });
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap justify-end gap-3 ">
        <ButtonExportRecebimentos />
        <ButtonNovoRecebimentoManual />
        <ButtonNovoRecebimentoBancario />
      </div>
      <FiltersRecebimentos refetch={refetchTitulos} />

      <DataTable
        sumField="valor"
        pagination={pagination}
        setPagination={setPagination}
        rowSelection={rowSelection}
        handleRowSelection={handleRowSelection}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
        isLoading={isLoading}
      />
      <ModalTituloReceber />
      <ModalRecebimentoManual />
      <ModalRecebimentoBancario />
    </div>
  );
};
