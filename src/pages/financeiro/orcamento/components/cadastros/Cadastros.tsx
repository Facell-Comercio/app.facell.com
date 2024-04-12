import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { useOrcamento } from "@/hooks/useOrcamento";
import ModalCadastro from "./cadastro/Modal";
import ModalReplicateCadastro from "./cadastro/ModalReplicateCadastro";
import { useStoreCadastro } from "./cadastro/store";
import FilterCadastros from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableCadastro } from "./table/store-table";

const Cadastros = () => {
  console.log("RENDER - Section-Titulos");
  const [pagination, setPagination, filters] = useStoreTableCadastro(
    (state) => [state.pagination, state.setPagination, state.filters]
  );
  const { data, refetch } = useOrcamento().getAll({
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
        <Button variant={"secondary"} onClick={handleClickNewCadastro}>
          Novo Orçamento
        </Button>
      </div>
      <FilterCadastros refetch={refetch} />
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
      />
      <ModalCadastro />
      <ModalReplicateCadastro />
    </div>
  );
};

export default Cadastros;
