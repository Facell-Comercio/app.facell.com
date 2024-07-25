import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";

import { useVales } from "@/hooks/comercial/useVales";
import { RadialChart } from "@/pages/comercial/vales/table/radial-chart";
import FiltersVale from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableVale } from "./table/store-table";
import ModalVale from "./vale/Modal";
import { useStoreVale } from "./vale/store";

const Vales = () => {
  const [pagination, setPagination, filters] = useStoreTableVale((state) => [
    state.pagination,
    state.setPagination,
    state.filters,
  ]);
  const { data, refetch, isLoading } = useVales().getAll({
    pagination,
    filters,
  });
  const rows = data?.rows || [];

  const rowCount = data?.rowCount || 0;
  const openModal = useStoreVale().openModal;
  const editModal = useStoreVale().editModal;
  function handleClickNewVale() {
    openModal("");
    editModal(true);
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex justify-between">
        <RadialChart />
        <Button variant={"secondary"} onClick={handleClickNewVale}>
          Novo Vale
        </Button>
      </div>
      <FiltersVale refetch={refetch} />

      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
        isLoading={isLoading}
      />
      <ModalVale />
    </div>
  );
};

export default Vales;
