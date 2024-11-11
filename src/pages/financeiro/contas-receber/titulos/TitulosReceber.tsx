import { DataTable } from "@/components/custom/DataTable";
import { useTituloReceber } from "@/hooks/financeiro/useTituloReceber";
import Filters from "./table/Filters";
import { useStoreTableReceber } from "./table/store-table";

import ButtonExportTitulosReceber from "./components/ButtonExportarTitulosReceber";
import ButtonImportTitulosReceber from "./components/ButtonImportarTituloReceber";
import ButtonNovoTituloReceber from "./components/ButtonNovoTituloReceber";
import HistoricoLogs from "./components/HistoricoLogs";
import { columnsTable } from "./table/columns";
import ModalTituloReceber from "./titulo/ModalTituloReceber";
import { checkUserDepartments, checkUserPermission } from "@/helpers/checkAuthorization";

const TitulosReceber = () => {
  const [pagination, setPagination, filters] = useStoreTableReceber((state) => [
    state.pagination,
    state.setPagination,
    state.filters,
  ]);
  const isMaster = checkUserPermission('MASTER');
  const isFinanceiro = checkUserDepartments('FINANCEIRO')

  const [handleRowSelection] = useStoreTableReceber((state) => [
    state.handleRowSelection,
  ]);

  const { data, refetch, isLoading } = useTituloReceber().getAll({
    pagination,
    filters,
  });

  const rows = data?.rows || [];
  const rowCount = data?.rowCount || 0;

  function refetchTitulos() {
    refetch();
    handleRowSelection({ idSelection: [], rowSelection: {} });
  }

  const canImport = isMaster || isFinanceiro;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap justify-end gap-3 ">
        {canImport && <HistoricoLogs />}
        <ButtonExportTitulosReceber />
        {canImport && <ButtonImportTitulosReceber />}
        <ButtonNovoTituloReceber />
      </div>
      <Filters refetch={refetchTitulos} />

      <DataTable
        sumField="valor"
        pagination={pagination}
        setPagination={setPagination}
        // rowSelection={rowSelection}
        // handleRowSelection={handleRowSelection}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
        isLoading={isLoading}
      />
      <ModalTituloReceber />
    </div>
  );
};

export default TitulosReceber;
