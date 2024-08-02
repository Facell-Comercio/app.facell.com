import { DataTable } from "@/components/custom/DataTable";

import { checkUserPermission } from "@/helpers/checkAuthorization";

import { useMetas } from "@/hooks/comercial/useMetas";
import ButtonExportMeta from "./components/ButtonExportMeta";
import ButtonImportMeta from "./components/ButtonImportMeta";
import ButtonNovaMeta from "./components/ButtonNovaMeta";
import FiltersVale from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableMetas } from "./table/store-table";
import ModalVale from "./vale/Modal";

const Metas = () => {
  const [pagination, setPagination, filters, rowSelection, handleRowSelection] =
    useStoreTableMetas((state) => [
      state.pagination,
      state.setPagination,
      state.filters,
      state.rowSelection,
      state.handleRowSelection,
    ]);
  const { data, refetch, isLoading } = useMetas().getAll({
    pagination,
    filters,
  });
  const rows = data?.rows || [];

  const rowCount = data?.rowCount || 0;

  return (
    <div className="flex flex-col  gap-3 p-4">
      <div className="flex gap-2 justify-end">
        {checkUserPermission(["GERENCIAR_METAS", "MASTER"]) && (
          <ButtonImportMeta />
        )}
        <ButtonExportMeta />
        {checkUserPermission(["GERENCIAR_METAS", "MASTER"]) && (
          <ButtonNovaMeta />
        )}
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

export default Metas;
