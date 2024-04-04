import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { useRateios } from "@/hooks/useRateios";
import ModalRateios from "./rateio/Modal";
import { useStoreRateios } from "./rateio/store";
import { columnsTable } from "./table/columns";
import { useStoreTableRateios } from "./table/store-table";

const Rateios = () => {
  console.log("RENDER - Section-Plano Contas");
  const [pagination, setPagination, filters] = useStoreTableRateios((state) => [
    state.pagination,
    state.setPagination,
    state.filters,
  ]);
  const { data } = useRateios().getAll({
    pagination,
    filters,
  });
  const rows = data?.data?.rows || [];
  const rowCount = data?.data?.rowCount || 0;
  const openModal = useStoreRateios().openModal;
  const editModal = useStoreRateios().editModal;
  function handleClickNewRateios() {
    openModal("");
    editModal(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button variant={"secondary"} onClick={handleClickNewRateios}>
          Novo Rateio
        </Button>
      </div>
      {/* <FiltersRateios refetch={refetch} /> */}
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
      />
      <ModalRateios />
    </div>
  );
};

export default Rateios;
