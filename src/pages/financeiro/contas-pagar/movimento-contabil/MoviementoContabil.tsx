import { DataTable } from "@/components/custom/DataTable";
import { useMovimentoContabil } from "@/hooks/financeiro/useMovimentoContabil";
import FiltersMovimentoContabil from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableMovimentoContabil } from "./table/store-table";

const MovimentoContabil = () => {
  const [pagination, setPagination, filters] = useStoreTableMovimentoContabil(
    (state) => [state.pagination, state.setPagination, state.filters]
  );
  const { data, refetch, isLoading } = useMovimentoContabil().getAll({
    pagination,
    filters,
  });
  const rows = data?.data?.rows || [];
  const rowCount = data?.data?.rowCount || 0;

  return (
    <div className="flex flex-col gap-3">
      <FiltersMovimentoContabil refetch={refetch} />
      {filters.id_grupo_economico && (
        <DataTable
          pagination={pagination}
          setPagination={setPagination}
          data={rows}
          rowCount={rowCount}
          columns={columnsTable}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default MovimentoContabil;
