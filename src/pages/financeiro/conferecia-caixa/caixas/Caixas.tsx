// import { useAuthStore } from "@/context/auth-store";

import { DataTable } from "@/components/custom/DataTable";
import { useConferenciasCaixa } from "@/hooks/financeiro/useConferenciasCaixa";
import { useLocation } from "react-router-dom";
import ModalCaixa from "./caixa/Modal";
import FiltersCaixas from "./FiltersCaixas";
import { columnsTable } from "./table/columns";
import { useStoreTableCaixas } from "./table/store-table";

const Caixas = () => {
  const uri = `/financeiro/conferencia-de-caixa/filiais`;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id_filial = searchParams.get("id") || "";
  const [filters, pagination, setPagination] = useStoreTableCaixas((state) => [
    state.filters,
    state.pagination,
    state.setPagination,
  ]);
  const { data, refetch, isLoading, isSuccess } = useConferenciasCaixa().getAll(
    {
      filters: {
        ...filters,
        id_filial,
      },
      pagination,
    }
  );

  const rows = data?.rows;
  const rowCount = data?.rowCount;

  return (
    <section className="flex flex-col p-4 w-full">
      <FiltersCaixas refetch={refetch} />
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
      <ModalCaixa />
    </section>
  );
};

export default Caixas;
