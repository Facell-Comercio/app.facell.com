// import { useAuthStore } from "@/context/auth-store";

import { DataTable } from "@/components/custom/DataTable";
import { useConferenciasCaixa } from "@/hooks/financeiro/useConferenciasCaixa";
import ModalBoleto from "./boleto/Modal";
import ExportBoleto from "./components/ExportBoleto";
import FiltersBoletos from "./FiltersBoletos";
import { columnsTable } from "./table/columns";
import { useStoreTableBoletos } from "./table/store-table";
import ModalReceptoresBoletos from "./components/ModalReceptores";

const Boletos = () => {
  const [pagination, setPagination, filters] = useStoreTableBoletos((state) => [
    state.pagination,
    state.setPagination,
    state.filters,
  ]);
  const { data, refetch, isSuccess, isLoading } = useConferenciasCaixa().getAllBoletos({
    pagination,
    filters,
  });
  const rows = data?.rows || [];
  const rowCount = data?.rowCount || 0;

  return (
    <section className="flex flex-col gap-3 max-w-full">
      <div className="flex justify-end gap-3 items-center">
        <ModalReceptoresBoletos/>
        <ExportBoleto />
      </div>
      <FiltersBoletos refetch={refetch} />
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
      <ModalBoleto />
    </section>
  );
};

export default Boletos;
