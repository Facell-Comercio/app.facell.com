import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { useFornecedores } from "@/hooks/financeiro/useFornecedores";
import ModalFornecedor from "./fornecedor/Modal";
import { useStoreFornecedor } from "./fornecedor/store";
import FilterFornecedores from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableFornecedor } from "./table/store-table";

const Fornecedores = () => {
  const [pagination, setPagination, filters] = useStoreTableFornecedor(
    (state) => [state.pagination, state.setPagination, state.filters]
  );
  const { data, refetch, isLoading } = useFornecedores().getAll({
    pagination,
    filters,
  });
  const rows = data?.data?.rows || [];
  const rowCount = data?.data?.rowCount || 0;

  const openModal = useStoreFornecedor().openModal;
  const editModal = useStoreFornecedor().editModal;
  function handleClickNewFornecedor() {
    openModal("");
    editModal(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button variant={"secondary"} onClick={handleClickNewFornecedor}>
          Novo Fornecedor
        </Button>
      </div>
      <FilterFornecedores refetch={refetch} />
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
        isLoading={isLoading}
      />
      <ModalFornecedor />
    </div>
  );
};

export default Fornecedores;
