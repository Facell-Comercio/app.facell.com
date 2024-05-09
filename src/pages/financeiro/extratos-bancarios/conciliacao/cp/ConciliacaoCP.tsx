import { DataTable } from "@/components/custom/DataTable";
import { useConciliacaoCP } from "@/hooks/financeiro/useConciliacaoCP";
import ModalConciliacaoCP from "./components/Modal";
import FiltersConciliacaoCP from "./table-cp/Filters";
import { columnsTable } from "./table-cp/columns";
import { useStoreTableConciliacaoCP } from "./table-cp/store-table";

const ConciliacaoCP = () => {
  console.log("RENDER - Section ConciliacaoCP");
  const [pagination, setPagination, filters] = useStoreTableConciliacaoCP(
    (state) => [state.pagination, state.setPagination, state.filters]
  );
  const { data, refetch, isLoading } = useConciliacaoCP().getAll({
    pagination,
    filters,
  });
  const rows = data?.data?.rows || [];
  const rowCount = data?.data?.rowCount || 0;
  console.log(rows);

  return (
    <div className="flex flex-col gap-3">
      <FiltersConciliacaoCP refetch={refetch} />
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
        isLoading={isLoading}
      />
      <ModalConciliacaoCP />
    </div>
  );
};

export default ConciliacaoCP;
