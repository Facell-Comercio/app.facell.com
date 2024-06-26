import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { useOrcamento } from "@/hooks/financeiro/useOrcamento";
import { Plus } from "lucide-react";
import ModalCadastro from "./cadastro/Modal";
import ModalLogs from "./cadastro/ModalLogs";
import ModalReplicateCadastro from "./cadastro/ModalReplicateCadastro";
import { useStoreCadastro } from "./cadastro/store";
import FilterCadastros from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableCadastro } from "./table/store-table";

const Cadastros = () => {

  const [pagination, setPagination, filters] = useStoreTableCadastro(
    (state) => [state.pagination, state.setPagination, state.filters]
  );
  const { data, refetch, isLoading } = useOrcamento().getAll({
    pagination,
    filters,
  });
  const rows = data?.data?.rows || [];
  const rowCount = data?.data?.rowCount || 0;

  const openModal = useStoreCadastro().openModal;
  const editModal = useStoreCadastro((state) => state.editModal);
  function handleClickNewCadastro() {
    openModal("");
    editModal(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button variant={"default"} onClick={handleClickNewCadastro}>
          <Plus size={18} className="me-2" /> Novo Orçamento
        </Button>
      </div>
      <FilterCadastros refetch={refetch} />
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
        isLoading={isLoading}
      />
      <ModalCadastro />
      <ModalLogs />
      <ModalReplicateCadastro />
    </div>
  );
};

export default Cadastros;
