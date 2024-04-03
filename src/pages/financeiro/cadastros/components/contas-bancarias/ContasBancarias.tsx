import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { useContasBancarias } from "@/hooks/useContasBancarias";
import ModalContaBancaria from "./conta-bancaria/Modal";
import { useStoreContaBancaria } from "./conta-bancaria/store";
import FiltersContasBancarias from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableContasBancarias } from "./table/store-table";

const ContasBancarias = () => {
  console.log("RENDER - Section-Plano Contas");
  const [pagination, setPagination, filters] = useStoreTableContasBancarias(
    (state) => [state.pagination, state.setPagination, state.filters]
  );
  const { data, refetch } = useContasBancarias().getAll({
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
      <div className="flex justify-between">
        <h2 className="text-3xl font-medium">Contas Bancarias</h2>
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
      />
      <ModalContaBancaria />
    </div>
  );
};

export default ContasBancarias;
