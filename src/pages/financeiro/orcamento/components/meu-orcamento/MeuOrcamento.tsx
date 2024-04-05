import { DataTable } from "@/components/custom/DataTable";
import { useOrcamento } from "@/hooks/useOrcamento";
import ModalMeuOrcamento from "./orcamento/Modal";
import FilterMeuOrcamento from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableMeuOrcamento } from "./table/store-table";

const MeuOrcamento = () => {
  console.log("RENDER - Section-Titulos");
  const [pagination, setPagination, filters] = useStoreTableMeuOrcamento(
    (state) => [state.pagination, state.setPagination, state.filters]
  );
  const { data, refetch } = useOrcamento().getMyBudget({
    pagination,
    filters,
  });
  const rows = data?.data?.rows || [];
  const rowCount = data?.data?.rowCount || 0;
  console.log(rows);

  return (
    <div className="flex flex-col gap-3">
      <FilterMeuOrcamento refetch={refetch} />
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
      />{" "}
      <ModalMeuOrcamento />
    </div>
  );
};

export default MeuOrcamento;
