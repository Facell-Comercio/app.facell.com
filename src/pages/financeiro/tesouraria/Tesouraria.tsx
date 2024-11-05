// import { useAuthStore } from "@/context/auth-store";

import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { useTesouraria } from "@/hooks/financeiro/useTesouraria";
import { ArrowLeftRight } from "lucide-react";
import ModalTesouraria from "./components/Modal";
import ModalTransferenciaTesouraria from "./components/ModalTransferenciaTesouraria";
import FiltersTesouraria from "./FiltersTesouraria";
import { useStoreTesouraria } from "./store";
import { columnsTable } from "./table/columns";
import { useStoreTableTesouraria } from "./table/store-table";

const TesourariaPage = () => {
  const [pagination, setPagination, filters] = useStoreTableTesouraria((state) => [
    state.pagination,
    state.setPagination,
    state.filters,
  ]);
  const openTransferModal = useStoreTesouraria().openTransferModal;
  const { data, refetch, isSuccess, isLoading } = useTesouraria().getAll({
    pagination,
    filters,
  });
  const rows = data?.rows || [];
  const rowCount = data?.rowCount || 0;

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex justify-end">
        <Button onClick={() => openTransferModal()}>
          <ArrowLeftRight className="me-2" size={20} /> Transferência
        </Button>
      </div>
      <FiltersTesouraria refetch={refetch} />
      {isSuccess && (
        <DataTable
          pagination={pagination}
          setPagination={setPagination}
          data={rows}
          rowCount={rowCount}
          columns={columnsTable}
          isLoading={isLoading}
        />
      )}
      <ModalTesouraria />
      <ModalTransferenciaTesouraria />
    </div>
  );
};

export default TesourariaPage;
