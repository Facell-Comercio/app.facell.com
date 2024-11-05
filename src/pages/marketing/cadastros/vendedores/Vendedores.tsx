import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { useCadastros } from "@/hooks/marketing/useCadastros";
import { Plus } from "lucide-react";
import FilterVendedores from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableVendedores } from "./table/store-table";
import ModalVendedor from "./vendedor/Modal";
import { useStoreVendedor } from "./vendedor/store";

const Vendedores = () => {
  const [pagination, setPagination, filters] = useStoreTableVendedores((state) => [
    state.pagination,
    state.setPagination,
    state.filters,
  ]);
  const { data, refetch, isLoading } = useCadastros().getAllVendedores({
    pagination,
    filters,
  });
  const rows = data?.rows || [];
  const rowCount = data?.rowCount || 0;

  const openModal = useStoreVendedor().openModal;
  const editModal = useStoreVendedor().editModal;
  function handleClickNewVendedor() {
    openModal("");
    editModal(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button variant={"secondary"} onClick={handleClickNewVendedor}>
          <Plus className="me-2" /> Novo Vendedor
        </Button>
      </div>
      <FilterVendedores refetch={refetch} />
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
        isLoading={isLoading}
      />
      <ModalVendedor />
    </div>
  );
};

export default Vendedores;
