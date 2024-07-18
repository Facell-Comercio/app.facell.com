import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { useCartoes } from "@/hooks/financeiro/useCartoes";
import ModalCartao from "./cartao/Modal";
import { useStoreCartao } from "./cartao/store";
import FiltersCartao from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableCartao } from "./table/store-table";

const Cartoes = () => {
  const [pagination, setPagination, filters] = useStoreTableCartao((state) => [
    state.pagination,
    state.setPagination,
    state.filters,
  ]);
  const { data, refetch, isLoading } = useCartoes().getAll({
    pagination,
    filters,
  });
  const rows = data?.rows || [];

  const rowCount = data?.rowCount || 0;
  const openModal = useStoreCartao().openModal;
  const editModal = useStoreCartao().editModal;
  function handleClickNewCartao() {
    openModal("");
    editModal(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button variant={"secondary"} onClick={handleClickNewCartao}>
          Novo Cartão
        </Button>
      </div>
      <FiltersCartao refetch={refetch} />

      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
        isLoading={isLoading}
      />
      <ModalCartao />
    </div>
  );
};

export default Cartoes;
