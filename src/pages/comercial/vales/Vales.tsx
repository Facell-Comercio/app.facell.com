import { DataTable } from "@/components/custom/DataTable";

import { checkUserPermission } from "@/helpers/checkAuthorization";
import { useVales } from "@/hooks/comercial/useVales";
import ButtonExportVale from "./components/ButtonExportVale";
import ButtonImportVale from "./components/ButtonImportVale";
import ButtonNovoVale from "./components/ButtonNovoVale";
import FiltersVale from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableVale } from "./table/store-table";
import ModalVale from "./vale/Modal";

const Vales = () => {
  const [pagination, setPagination, filters, rowSelection, handleRowSelection] =
    useStoreTableVale((state) => [
      state.pagination,
      state.setPagination,
      state.filters,
      state.rowSelection,
      state.handleRowSelection,
    ]);
  const { data, refetch, isLoading } = useVales().getAll({
    pagination,
    filters,
  });
  const rows = data?.rows || [];

  const rowCount = data?.rowCount || 0;

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex justify-end">
        {/* <RadialChart /> */}
        <span className="flex gap-2">
          {checkUserPermission(["GERENCIAR_VALES", "MASTER"]) && (
            <ButtonImportVale />
          )}
          <ButtonExportVale />
          {checkUserPermission(["GERENCIAR_VALES", "MASTER"]) && (
            <ButtonNovoVale />
          )}
        </span>
      </div>
      <FiltersVale refetch={refetch} />

      <DataTable
        sumField="valor"
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        rowSelection={rowSelection}
        handleRowSelection={handleRowSelection}
        columns={columnsTable}
        isLoading={isLoading}
      />
      <ModalVale />
    </div>
  );
};

export default Vales;
