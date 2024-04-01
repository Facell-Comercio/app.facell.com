import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { usePlanoContas } from "@/hooks/usePlanoConta";
import { useStoreFornecedor } from "../fornecedores/fornecedor/store-fornecedor";
import ModalPlanoContas from "./plano-conta/ModalPlanoContas";
import FiltersPlanoContas from "./table-plano-contas/Filters";
import { columnsTable } from "./table-plano-contas/columns";
import { useStoreTablePlanoContas } from "./table-plano-contas/store-table";

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
  const openModal = useStoreFornecedor().openModal;
  const editModal = useStoreFornecedor().editModal;
  function handleClickNewFornecedor() {
    openModal("");
    editModal(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between">
        <h2 className="text-3xl font-medium">Plano de Contas</h2>
        <Button variant={"secondary"} onClick={handleClickNewFornecedor}>
          Novo Fornecedor
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
