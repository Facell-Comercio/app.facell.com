import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { useCentroCustos } from "@/hooks/financeiro/useCentroCustos";
import ModalFornecedor from "./centro-custo/Modal";
import { useStoreCentroCustos } from "./centro-custo/store";
import FilterCentroCustos from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableCentroCusto } from "./table/store-table";

const CentroCustos = () => {
  const [pagination, setPagination, filters] = useStoreTableCentroCusto(
    (state) => [state.pagination, state.setPagination, state.filters]
  );
  const { data, refetch, isLoading } = useCentroCustos().getAll({
    pagination,
    filters,
  });
  const rows = data?.data?.rows || [];
  const rowCount = data?.data?.rowCount || 0;

  const openModal = useStoreCentroCustos().openModal;
  const editModal = useStoreCentroCustos().editModal;
  function handleClickNewFornecedor() {
    openModal("");
    editModal(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button variant={"secondary"} onClick={handleClickNewFornecedor}>
          Novo Centro de Custos
        </Button>
      </div>
      <FilterCentroCustos refetch={refetch} />
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
        isLoading={isLoading}
      />
      <ModalFornecedor />
    </div>
  );
};

export default CentroCustos;
