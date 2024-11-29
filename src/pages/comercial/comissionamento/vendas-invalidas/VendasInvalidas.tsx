import { DataTable } from "@/components/custom/DataTable";

import { useVendasInvalidas } from "@/hooks/comercial/useVendasInvalidas";
import ButtonExcluir from "./components/ButtonExcluir";
import ButtonProcessar from "./components/ButtonProcessar";
import { columnsTable } from "./table/columns";
import FiltersVendasInvalidas from "./table/Filters";
import { useStoreTableVendasInvalidas } from "./table/store-table";

const VendasInvalidas = () => {
  const [pagination, setPagination, filters] =
    useStoreTableVendasInvalidas((state) => [
      state.pagination,
      state.setPagination,
      state.filters,
    ]);

  const { data, refetch, isLoading } =
    useVendasInvalidas().getAll({
      pagination,
      filters,
    });

  const rows = data?.rows || [];

  const rowCount = data?.rowCount || 0;

  return (
    <div className="flex flex-col gap-3">
      <FiltersVendasInvalidas refetch={refetch} />
      {/* <div className="flex gap-2 justify-end">
        {checkUserPermission([
          "GERENCIAR_VENDASINVALIDAS",
          "MASTER",
        ]) && <ButtonImportMeta />}
        {checkUserPermission([
          "GERENCIAR_VENDASINVALIDAS",
          "MASTER",
        ]) && <ButtonNovaMeta />}
      </div> */}
      <div className="flex gap-2 justify-between">
        <ButtonProcessar />
        <ButtonExcluir />
      </div>

      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
        isLoading={isLoading}
      />
    </div>
  );
};

export default VendasInvalidas;
