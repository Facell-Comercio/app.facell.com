import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { useBancos } from "@/hooks/useBancos";
import ModalBanco from "./bancos/Modal";
import { useStoreBanco } from "./bancos/store";
import FilterBancos from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableBancos } from "./table/store-table";

const Bancos = () => {
  console.log("RENDER - Section-Titulos");
  const [pagination, setPagination, filters] = useStoreTableBancos((state) => [
    state.pagination,
    state.setPagination,
    state.filters,
  ]);
  const { data, refetch } = useBancos().getAll({
    pagination,
    filters,
  });
  const rows = data?.data?.rows || [];
  const rowCount = data?.data?.rowCount || 0;

  const openModal = useStoreBanco().openModal;
  const editModal = useStoreBanco().editModal;
  function handleClickNewBanco() {
    openModal("");
    editModal(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button variant={"secondary"} onClick={handleClickNewBanco}>
          Novo Banco
        </Button>
      </div>
      <FilterBancos refetch={refetch} />
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
      />
      <ModalBanco />
    </div>
  );
};

export default Bancos;
