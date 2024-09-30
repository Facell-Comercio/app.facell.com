import { DataTable } from "@/components/custom/DataTable";
import { useStoreTableReceber } from "./table/store-table";
import { useTituloReceber } from "@/hooks/financeiro/useTituloReceber";
import Filters from "./table/Filters";

import ButtonExportTitulos from "./components/ButtonExportarTitulos";
import ButtonImportTitulos from "./components/ButtonImportarTitulo";
import ButtonNovoTitulo from "./components/ButtonNovoTitulo";
import { columnsTable } from "./table/columns";
import ModalTituloReceber from "./titulo/ModalTituloReceber";

const TitulosReceber = () => {

  const [pagination, setPagination, filters] = useStoreTableReceber((state) => [
    state.pagination,
    state.setPagination,
    state.filters,
  ]);
  const [rowSelection, handleRowSelection] = useStoreTableReceber((state) => [
    state.rowSelection,
    state.handleRowSelection,
    state.idSelection,
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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap justify-end gap-3 ">
        <ButtonExportTitulos />
        <ButtonImportTitulos />
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
      <ModalTituloReceber />
    </div>
  );
};

export default TitulosReceber;
