import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
// import { useCentroCustos } from "@/hooks/useCentroCustos";
import { useCentroCustos } from "@/hooks/useCentroCustos";
import ModalFornecedor from "./centro-custo/Modal";
import { useStoreCentroCustos } from "./centro-custo/store";
import FilterCentroCustos from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableCentroCusto } from "./table/store-table";

const CentroCustos = () => {
  console.log("RENDER - Section-Titulos");
  const [pagination, setPagination, filters] = useStoreTableCentroCusto(
    (state) => [state.pagination, state.setPagination, state.filters]
  );
  const { data, refetch } = useCentroCustos().getAll({
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

  console.log("FILTROS ", filters);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between">
        <h2 className="text-3xl font-medium">Centro de Custos</h2>

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
      />
      <ModalFornecedor />
    </div>
  );
};

export default CentroCustos;
