import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { useBordero } from "@/hooks/useBordero";
import ModalBordero from "./bordero/Modal";
import { useStoreBordero } from "./bordero/store";
import FiltersBorderos from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableBorderos } from "./table/store-table";

const Borderos = () => {
  console.log("RENDER - Section-Plano Contas");
  const [pagination, setPagination, filters] = useStoreTableBorderos(
    (state) => [state.pagination, state.setPagination, state.filters]
  );
  const { data, refetch } = useBordero().getAll({
    pagination,
    filters,
  });
  const rows = data?.data?.rows || [];
  const rowCount = data?.data?.rowCount || 0;
  const openModal = useStoreBordero().openModal;
  const editModal = useStoreBordero().editModal;
  function handleClickNewBorderos() {
    openModal("");
    editModal(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button variant={"secondary"} onClick={handleClickNewBorderos}>
          Novo Borderô
        </Button>
      </div>
      <FiltersBorderos refetch={refetch} />
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
      />
      <ModalBordero />
    </div>
  );
};

export default Borderos;
