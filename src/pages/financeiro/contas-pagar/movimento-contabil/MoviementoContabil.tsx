import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/helpers/importExportXLS";
import { useMovimentoContabil } from "@/hooks/financeiro/useMovimentoContabil";
import { api } from "@/lib/axios";
import { Download } from "lucide-react";
import ModalMovimentoContabil from "./movimento/Modal";
import { useStoreMovimentoContabil } from "./movimento/store";
import FiltersMovimentoContabil from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableMovimentoContabil } from "./table/store-table";

const MovimentoContabil = () => {
  console.log("RENDER - Section MovimentoContabil");
  const [pagination, setPagination, filters] = useStoreTableMovimentoContabil(
    (state) => [state.pagination, state.setPagination, state.filters]
  );
  const { data, refetch, isLoading } = useMovimentoContabil().getAll({
    pagination,
    filters,
  });
  const rows = data?.data?.rows || [];
  const rowCount = data?.data?.rowCount || 0;
  const openModal = useStoreMovimentoContabil().openModal;
  const editModal = useStoreMovimentoContabil().editModal;
  function handleClickNewMovimentoContabil() {
    openModal("");
    editModal(true);
  }

  async function exportMovimentoContabil(ids: string[]) {
    const response = await api.put(
      `/financeiro/contas-a-pagar/bordero/export`,
      { data: ids }
    );
    exportToExcel(response.data, `borderos`);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between">
        <Button
          variant={"outline"}
          type={"button"}
          onClick={() =>
            exportMovimentoContabil(rows.map((row: any) => row.id) || "")
          }
        >
          <Download className="me-2" size={20} />
          Exportar
        </Button>
        <Button variant={"secondary"} onClick={handleClickNewMovimentoContabil}>
          Novo Borderô
        </Button>
      </div>
      <FiltersMovimentoContabil refetch={refetch} />
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
        isLoading={isLoading}
      />
      <ModalMovimentoContabil />
    </div>
  );
};

export default MovimentoContabil;
