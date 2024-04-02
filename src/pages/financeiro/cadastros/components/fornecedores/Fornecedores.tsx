import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { useFornecedores } from "@/hooks/useFornecedores";
import ModalFornecedor from "./fornecedor/Modal";
import { useStoreFornecedor } from "./fornecedor/store-fornecedor";
import FilterFornecedores from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableFornecedor } from "./table/store-table";

const Fornecedores = () => {
  console.log("RENDER - Section-Titulos");
  const [pagination, setPagination, filters] = useStoreTableFornecedor(
    (state) => [state.pagination, state.setPagination, state.filters]
  );
  const { data, refetch } = useFornecedores().getAll({
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
      <div className="flex justify-between">
        <h2 className="text-3xl font-medium">Fornecedores</h2>
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
      />
      <ModalFornecedor />
    </div>
  );
};

export default Fornecedores;
