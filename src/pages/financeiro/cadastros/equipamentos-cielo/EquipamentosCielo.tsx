import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { useEquipamentos } from "@/hooks/useEquipamentos";
import ModalEquipamento from "./equipamento/Modal";
import { useStoreEquipamento } from "./equipamento/store";
import FilterEquipamentos from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableEquipamentos } from "./table/store-table";

const EquipamentosCielo = () => {
  console.log("RENDER - Section-Titulos");
  const [pagination, setPagination, filters] = useStoreTableEquipamentos(
    (state) => [state.pagination, state.setPagination, state.filters]
  );
  const { data, refetch, isLoading } = useEquipamentos().getAll({
    pagination,
    filters,
  });
  const rows = data?.data?.rows || [];
  const rowCount = data?.data?.rowCount || 0;

  const openModal = useStoreEquipamento().openModal;
  const editModal = useStoreEquipamento().editModal;
  function handleClickNewEquipamento() {
    openModal("");
    editModal(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button variant={"secondary"} onClick={handleClickNewEquipamento}>
          Novo Equipamento
        </Button>
      </div>
      <FilterEquipamentos refetch={refetch} />
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
        isLoading={isLoading}
      />
      <ModalEquipamento />
    </div>
  );
};

export default EquipamentosCielo;
