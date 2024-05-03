import { useStoreTablePagar } from "./table/store-table";
// import { useStoreTitulo } from "./titulo/store-titulo";
import { DataTable } from "@/components/custom/DataTable";

import {
  checkUserDepartments,
  checkUserPermission,
} from "@/helpers/checkAuthorization";
import { useTituloPagar } from "@/hooks/useTituloPagar";
import Filters from "./FiltersTitulosPagar";
import ModalAlteracoesLote from "./alteracao-lote/Modal";
import ModalRecorrencias from "./recorrencias/Modal";
import { columnsTable } from "./table/columns";
import ModalTituloPagar from "./titulo/Modal";
import ButtonRecorrencias from "./components/ButtonRecorrencias";
import ButtonExportTitulos from "./components/ButtonExportarTitulos";
import ButtonNovoTitulo from "./components/ButtonNovoTitulo";
import ButtonEditTitulos from "./components/ButtonEditTitulos";

const TitulosPagar = () => {
  // console.log("RENDER - Section-Titulos");
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
  ]);

  const { data, refetch } = useTituloPagar().getAll({ pagination, filters });

  const rows = data?.data?.rows || [];
  const rowCount = data?.data?.rowCount || 0;

  function refetchTitulos() {
    refetch();
    handleRowSelection({ idSelection: [], rowSelection: {} });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap justify-end gap-3 ">
        {isMaster && (
          <ButtonEditTitulos/>
        )}

        <ButtonExportTitulos/>

        <ButtonRecorrencias/>

        <ButtonNovoTitulo/>
      </div>
      <Filters refetch={refetchTitulos} />

      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        rowSelection={rowSelection}
        handleRowSelection={handleRowSelection}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
      />
      <ModalTituloPagar />
      <ModalRecorrencias />
      <ModalAlteracoesLote />
    </div>
  );
};

export default TitulosPagar;
