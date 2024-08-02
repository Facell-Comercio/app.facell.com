import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { useColaboradores } from "@/hooks/pessoal/useColaboradores";
import ModalColaborador from "./colaborador/Modal";
import { useStoreColaborador } from "./colaborador/store";
import { columnsTable } from "./table/columns";
import FilterColaboradores from "./table/Filters";
import { useStoreTableColaboradores } from "./table/store-table";

const Colaboradores = () => {
  const [pagination, setPagination, filters] = useStoreTableColaboradores(
    (state) => [state.pagination, state.setPagination, state.filters]
  );
  const { data, refetch, isLoading } = useColaboradores().getAll({
    pagination,
    filters,
  });

  const rows = data?.rows || [];
  const rowCount = data?.rowCount || 0;

  const openModal = useStoreColaborador().openModal;
  const editModal = useStoreColaborador().editModal;
  function handleClickNewColaborador() {
    openModal("");
    editModal(true);
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex justify-end">
        <Button variant={"secondary"} onClick={handleClickNewColaborador}>
          Novo Colaborador
        </Button>
      </div>
      <FilterColaboradores refetch={refetch} />
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
        isLoading={isLoading}
      />
      <ModalColaborador />
    </div>
  );
};

export default Colaboradores;
