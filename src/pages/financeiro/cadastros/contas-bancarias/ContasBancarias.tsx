import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { useContasBancarias } from "@/hooks/financeiro/useContasBancarias";
import ModalContaBancaria from "./conta-bancaria/Modal";
import { useStoreContaBancaria } from "./conta-bancaria/store";
import FiltersContasBancarias from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableContasBancarias } from "./table/store-table";

const ContasBancarias = () => {
  const [pagination, setPagination, filters] = useStoreTableContasBancarias(
    (state) => [state.pagination, state.setPagination, state.filters]
  );
  const { data, refetch, isLoading } = useContasBancarias().getAll({
    pagination,
    filters,
  });

  const rows = data?.data?.rows || [];
  const rowCount = data?.data?.rowCount || 0;
  const openModal = useStoreContaBancaria().openModal;
  const editModal = useStoreContaBancaria().editModal;
  function handleClickNewContasBancarias() {
    openModal("");
    editModal(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button variant={"secondary"} onClick={handleClickNewContasBancarias}>
          Nova Conta Bancaria
        </Button>
      </div>
      <FiltersContasBancarias refetch={refetch} />
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
        isLoading={isLoading}
      />
      <ModalContaBancaria />
    </div>
  );
};

export default ContasBancarias;
