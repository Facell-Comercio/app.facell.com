import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { useCadastros } from "@/hooks/marketing/useCadastros";
import { Plus } from "lucide-react";
import ModalInteracaoManual from "./interacao/Modal";
import { useStoreInteracaoManual } from "./interacao/store";
import FilterInteracoesManuais from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableInteracoesManuais } from "./table/store-table";

const InteracoesManuais = () => {
  const [pagination, setPagination, filters] = useStoreTableInteracoesManuais((state) => [
    state.pagination,
    state.setPagination,
    state.filters,
  ]);
  const { data, refetch, isLoading } = useCadastros().getAllInteracoesManuais({
    pagination,
    filters,
  });
  const rows = data?.rows || [];
  const rowCount = data?.rowCount || 0;

  const openModal = useStoreInteracaoManual().openModal;
  const editModal = useStoreInteracaoManual().editModal;
  function handleClickNewInteracaoManual() {
    openModal("");
    editModal(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button variant={"secondary"} onClick={handleClickNewInteracaoManual}>
          <Plus className="me-2" /> Nova Interação
        </Button>
      </div>
      <FilterInteracoesManuais refetch={refetch} />
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
        isLoading={isLoading}
      />
      <ModalInteracaoManual />
    </div>
  );
};

export default InteracoesManuais;
