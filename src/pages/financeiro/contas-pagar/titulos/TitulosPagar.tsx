import { DataTable } from "@/components/custom/DataTable";
import { useStoreTablePagar } from "./table/store-table";

import {
  checkUserDepartments,
  checkUserPermission,
} from "@/helpers/checkAuthorization";
import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import Filters from "./FiltersTitulosPagar";
import ModalAlteracoesLote from "./alteracao-lote/Modal";
import ButtonEditTitulos from "./components/ButtonEditTitulos";
import ButtonExportTitulos from "./components/ButtonExportarTitulos";
import ButtonImportTitulos from "./components/ButtonImportarTitulo";
import ButtonNovoTitulo from "./components/ButtonNovoTitulo";
import ButtonRecorrencias from "./components/ButtonRecorrencias";
import ModalExportDatasys from "./export-datasys/Modal";
import ModalRecorrencias from "./recorrencias/Modal";
import { columnsTable } from "./table/columns";
import ModalTituloPagar from "./titulo/Modal";

const TitulosPagar = () => {
  const isMaster =
    checkUserDepartments("FINANCEIRO") || checkUserPermission("MASTER");

  const [pagination, setPagination, filters] = useStoreTablePagar((state) => [
    state.pagination,
    state.setPagination,
    state.filters,
  ]);
  const [rowSelection, handleRowSelection] = useStoreTablePagar((state) => [
    state.rowSelection,
    state.handleRowSelection,
    state.idSelection,
  ]);

  const { data, refetch, isLoading } = useTituloPagar().getAll({
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
        {isMaster && <ButtonEditTitulos />}
        <ButtonExportTitulos />
        <ButtonImportTitulos />
        <ButtonRecorrencias />
        <ButtonNovoTitulo />
      </div>
      <Filters refetch={refetchTitulos} />

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
      <ModalTituloPagar />
      <ModalRecorrencias />
      <ModalAlteracoesLote />
      <ModalExportDatasys />
    </div>
  );
};

export default TitulosPagar;
