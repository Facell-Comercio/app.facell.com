import { DataTable } from "@/components/custom/DataTable";

import { hasPermission } from "@/helpers/checkAuthorization";
import { normalizeCurrency } from "@/helpers/mask";
import { useVales } from "@/hooks/comercial/useVales";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ButtonAbonar from "./components/ButtonAbonar";
import ButtonExportVale from "./components/ButtonExportVale";
import ButtonImportVale from "./components/ButtonImportVale";
import ButtonNovoVale from "./components/ButtonNovoVale";
import FiltersVale from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableVale } from "./table/store-table";
import ModalVale from "./vale/Modal";
import { useStoreVale } from "./vale/store";

const ComercialVales = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id_vale = searchParams.get("id") || "";

  const [pagination, setPagination, filters, rowSelection, handleRowSelection] = useStoreTableVale(
    (state) => [
      state.pagination,
      state.setPagination,
      state.filters,
      state.rowSelection,
      state.handleRowSelection,
    ]
  );

  const [openModal] = useStoreVale((state) => [state.openModal]);

  const { data, refetch, isLoading } = useVales().getAll({
    pagination,
    filters,
  });
  const rows = data?.rows || [];

  const rowCount = data?.rowCount || 0;
  const saldoTotal = data?.saldoTotal;
  const valorTotal = data?.valorTotal;
  const valorAbatido = data?.valorAbatido;

  useEffect(() => {
    if (id_vale) {
      openModal(id_vale);
    }
  }, [id_vale]);

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
          {hasPermission(["VALES:EDITAR", "MASTER"]) && <ButtonAbonar />}
          {hasPermission(["VALES:CRIAR", "MASTER"]) && <ButtonImportVale />}
          <ButtonExportVale />
          {hasPermission(["VALES:CRIAR", "MASTER"]) && <ButtonNovoVale />}
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

export default ComercialVales;
