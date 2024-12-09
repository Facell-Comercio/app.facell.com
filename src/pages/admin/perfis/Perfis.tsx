import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { usePerfil } from "@/hooks/adm/usePerfil";
import ModalPerfis from "./perfil/Modal";
import { useStorePerfil } from "./perfil/store";
import Filters from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTablePerfis } from "./table/store-table";

const Perfis = () => {
  const [pagination, setPagination, filters] = useStoreTablePerfis((state) => [
    state.pagination,
    state.setPagination,
    state.filters,
  ]);
  const { data, refetch } = usePerfil().getAll({ pagination, filters });
  const rows = data?.rows || [];
  const rowCount = data?.rowCount || 0;

  const openModal = useStorePerfil().openModal;
  const editModal = useStorePerfil().editModal;

  function handleClickNew() {
    openModal("");
    editModal(true);
  }

  return (
    <div>
      <div className="flex justify-end mb-3">
        <Button variant={"secondary"} onClick={handleClickNew}>
          Novo Perfil
        </Button>
      </div>
      <Filters refetch={refetch} />
      <ModalPerfis />
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
      />
    </div>
  );
};

export default Perfis;
