import { DataTable } from "@/components/custom/DataTable";

import { useEspelhos } from "@/hooks/comercial/useEspelhos";
import ButtonCalcularEspelho from "./components/ButtonCalcularEspelho";
import ButtonContestacoes from "./components/ButtonContestacoes";
import ButtonExportEspelho from "./components/ButtonExportEspelho";
import { columnsTable } from "./table/columns";
import FiltersEspelhos from "./table/Filters";
import { useStoreTableEspelhos } from "./table/store-table";

const Espelhos = () => {
  const [pagination, setPagination, filters] =
    useStoreTableEspelhos((state) => [
      state.pagination,
      state.setPagination,
      state.filters,
    ]);

  const { data, refetch, isLoading } =
    useEspelhos().getAll({
      pagination,
      filters,
    });

  const rows = data?.rows || [];

  const rowCount = data?.rowCount || 0;

  return (
    <div className="flex flex-col gap-3">
      <FiltersEspelhos refetch={refetch} />
      {/* <div className="flex gap-2 justify-end">
        {checkUserPermission([
          "GERENCIAR_ESPELHOS",
          "MASTER",
        ]) && <ButtonImportMeta />}
        {checkUserPermission([
          "GERENCIAR_ESPELHOS",
          "MASTER",
        ]) && <ButtonNovaMeta />}
      </div> */}
      <div className="flex gap-2 justify-between">
        <span className="flex gap-2">
          <ButtonCalcularEspelho />
          <ButtonExportEspelho />
        </span>
        <ButtonContestacoes />
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

export default Espelhos;
