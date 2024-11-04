import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { useCadastros } from "@/hooks/marketing/useCadastros";
import { Plus } from "lucide-react";
import FilterPlanos from "../planos/table/Filters";
import { columnsTable } from "../planos/table/columns";
import { useStoreTablePlanos } from "../planos/table/store-table";
import ModalPlano from "./plano/Modal";
import { useStorePlanoMarketingMailing } from "./plano/store";

const Planos = () => {
  const [pagination, setPagination, filters] = useStoreTablePlanos((state) => [
    state.pagination,
    state.setPagination,
    state.filters,
  ]);
  const { data, refetch, isLoading } = useCadastros().getAllPlanos({
    pagination,
    filters,
  });
  const rows = data?.rows || [];
  const rowCount = data?.rowCount || 0;

  const openModal = useStorePlanoMarketingMailing().openModal;
  const editModal = useStorePlanoMarketingMailing().editModal;
  function handleClickNewPlano() {
    openModal("");
    editModal(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button variant={"secondary"} onClick={handleClickNewPlano}>
          <Plus className="me-2" /> Novo Plano
        </Button>
      </div>
      <FilterPlanos refetch={refetch} />
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
        isLoading={isLoading}
      />
      <ModalPlano />
    </div>
  );
};

export default Planos;
