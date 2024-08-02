import { DataTable } from "@/components/custom/DataTable";

import { checkUserPermission } from "@/helpers/checkAuthorization";
import { normalizeCurrency } from "@/helpers/mask";
import { useVales } from "@/hooks/comercial/useVales";
import ButtonExportVale from "./components/ButtonExportVale";
import ButtonImportVale from "./components/ButtonImportVale";
import ButtonNovoVale from "./components/ButtonNovoVale";
import FiltersVale from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableVale } from "./table/store-table";
import ModalVale from "./vale/Modal";

const Vales = () => {
  const [pagination, setPagination, filters, rowSelection, handleRowSelection] =
    useStoreTableVale((state) => [
      state.pagination,
      state.setPagination,
      state.filters,
      state.rowSelection,
      state.handleRowSelection,
    ]);
  const { data, refetch, isLoading } = useVales().getAll({
    pagination,
    filters,
  });
  const rows = data?.rows || [];
  // console.log(data);

  const rowCount = data?.rowCount || 0;
  const saldoTotal = data?.saldoTotal;
  const valorTotal = data?.valorTotal;
  const valorAbatido = data?.valorAbatido;

  return (
    <div className="flex flex-col  gap-3 p-4">
      <div className="flex gap-2 justify-between">
        {/* <RadialChart /> */}
        <span className="flex flex-col gap-1 text-xs">
          <p className="flex gap-1">
            <strong className="font-medium">Total:</strong>
            {normalizeCurrency(valorTotal)}
          </p>
          <p className="flex gap-1">
            <strong className="font-medium">Abatido:</strong>
            {normalizeCurrency(valorAbatido)}
          </p>
          <p className="flex gap-1">
            <strong className="font-medium">Saldo:</strong>
            {normalizeCurrency(saldoTotal)}
          </p>
        </span>
        <span className="flex flex-wrap gap-2 justify-end">
          {checkUserPermission(["GERENCIAR_VALES", "MASTER"]) && (
            <ButtonImportVale />
          )}
          <ButtonExportVale />
          {checkUserPermission(["GERENCIAR_VALES", "MASTER"]) && (
            <ButtonNovoVale />
          )}
        </span>
      </div>
      <FiltersVale refetch={refetch} />

      <DataTable
        sumField="valor"
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        rowSelection={rowSelection}
        handleRowSelection={handleRowSelection}
        columns={columnsTable}
        isLoading={isLoading}
      />
      <ModalVale />
    </div>
  );
};

export default Vales;
