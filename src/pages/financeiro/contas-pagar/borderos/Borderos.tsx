import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/helpers/importExportXLS";
import { useBordero } from "@/hooks/financeiro/useBordero";
import { api } from "@/lib/axios";
import { Download } from "lucide-react";
import ModalBordero from "./bordero/Modal";
import { useStoreBordero } from "./bordero/store";
import FiltersBorderos from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableBorderos } from "./table/store-table";

const Borderos = () => {
  console.log("RENDER - Section Borderos");
  const [pagination, setPagination, filters] = useStoreTableBorderos(
    (state) => [state.pagination, state.setPagination, state.filters]
  );
  const { data, refetch, isLoading } = useBordero().getAll({
    pagination,
    filters,
  });
  const rows = data?.data?.rows || [];
  const rowCount = data?.data?.rowCount || 0;
  const openModal = useStoreBordero().openModal;
  const editModal = useStoreBordero().editModal;
  function handleClickNewBorderos() {
    openModal("");
    editModal(true);
  }

  async function exportBordero(ids: string[]) {
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
          onClick={() => exportBordero(rows.map((row: any) => row.id) || "")}
        >
          <Download className="me-2" size={20} />
          Exportar
        </Button>
        <Button variant={"secondary"} onClick={handleClickNewBorderos}>
          Novo Borderô
        </Button>
      </div>
      <FiltersBorderos refetch={refetch} />
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
        isLoading={isLoading}
      />
      <ModalBordero />
    </div>
  );
};

export default Borderos;
