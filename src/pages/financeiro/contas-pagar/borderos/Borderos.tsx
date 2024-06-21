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
import BtnOptionsDDA from "./components/BtnOptionsDDA";
import { ModalDDA } from "./components/ModalDDA";

const Borderos = () => {
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
        <div className="flex gap-2">
          <Button
            variant={"outline"}
            type={"button"}
            onClick={() => exportBordero(rows.map((row: any) => row.id) || "")}
          >
            <Download className="me-2" size={20} />
            Exportar
          </Button>

          <BtnOptionsDDA />
        </div>

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
      <ModalDDA />
      <ModalBordero />
    </div>
  );
};

export default Borderos;
