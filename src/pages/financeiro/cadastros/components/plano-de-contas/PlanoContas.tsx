import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { usePlanoContas } from "@/hooks/usePlanoConta";
import ModalPlanoContas from "./plano-conta/Modal";
import { useStorePlanoContas } from "./plano-conta/store";
import FiltersPlanoContas from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTablePlanoContas } from "./table/store-table";

const PlanoContas = () => {
  console.log("RENDER - Section-Plano Contas");
  const [pagination, setPagination, filters] = useStoreTablePlanoContas(
    (state) => [state.pagination, state.setPagination, state.filters]
  );
  const { data, refetch } = usePlanoContas().getAll({
    pagination,
    filters,
  });
  const rows = data?.data?.rows || [];
  const rowCount = data?.data?.rowCount || 0;
  const openModal = useStorePlanoContas().openModal;
  const editModal = useStorePlanoContas().editModal;
  function handleClickNewPlanoContas() {
    openModal("");
    editModal(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button variant={"secondary"} onClick={handleClickNewPlanoContas}>
          Novo Plano de Contas
        </Button>
      </div>
      <FiltersPlanoContas refetch={refetch} />
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
      />
      <ModalPlanoContas />
    </div>
  );
};

export default PlanoContas;
