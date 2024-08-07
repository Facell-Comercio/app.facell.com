import { DataTable } from "@/components/custom/DataTable";

import { checkUserPermission } from "@/helpers/checkAuthorization";

import { useMetas } from "@/hooks/comercial/useMetas";
import { useStoreMetasAgregadores } from "../store-metas-agregadores";
import ButtonExportMeta from "./components/ButtonExportMetas";
import ButtonImportMeta from "./components/ButtonImportMeta";
import ButtonNovaMeta from "./components/ButtonNovaMeta";
import ModalMeta from "./meta/Modal";
import { columnsTable } from "./table/columns";
import FiltersMeta from "./table/Filters";
import { useStoreTableMetas } from "./table/store-table";

const Metas = () => {
  const [pagination, setPagination, filters] = useStoreTableMetas((state) => [
    state.pagination,
    state.setPagination,
    state.filters,
  ]);
  const [mes, ano] = useStoreMetasAgregadores((state) => [
    state.mes,
    state.ano,
  ]);
  const { data, refetch, isLoading } = useMetas().getAll({
    pagination,
    filters: {
      ...filters,
      mes,
      ano,
    },
  });

  const rows = data?.rows || [];

  const rowCount = data?.rowCount || 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 justify-end">
        {checkUserPermission(["GERENCIAR_METAS", "MASTER"]) && (
          <ButtonImportMeta />
        )}
        <ButtonExportMeta />
        {checkUserPermission(["GERENCIAR_METAS", "MASTER"]) && (
          <ButtonNovaMeta />
        )}
      </div>
      <FiltersMeta refetch={refetch} />

      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
        isLoading={isLoading}
      />
      <ModalMeta />
    </div>
  );
};

export default Metas;
