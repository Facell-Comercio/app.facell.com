// import { useAuthStore } from "@/context/auth-store";

import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { useConferenciasCaixa } from "@/hooks/financeiro/useConferenciasCaixa";
import { useEffect } from "react";
import { TbAlertTriangle } from "react-icons/tb";
import { useLocation } from "react-router-dom";
import ModalCaixa from "./caixa/Modal";
import ModalOcorrencias from "./caixa/ocorrencias/ModalOcorrencias";
import { useStoreCaixa } from "./caixa/store";
import FiltersCaixas from "./FiltersCaixas";
import { columnsTable } from "./table/columns";
import { useStoreTableCaixas } from "./table/store-table";

const Caixas = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id_filial = searchParams.get("id") || "";

  const [filters, pagination, setPagination] = useStoreTableCaixas((state) => [
    state.filters,
    state.pagination,
    state.setPagination,
  ]);

  const [openModalOcorrencias, setFilial] = useStoreCaixa((state) => [
    state.openModalOcorrencias,
    state.setFilial,
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
  const filial = data?.filial;
  const rowCount = data?.rowCount;

  useEffect(() => {
    setFilial(id_filial);
  }, [isSuccess]);

  return (
    <section className="flex flex-col gap-3 w-full">
      <div className="flex gap-2 justify-between items-center">
        <h3 className="text-md font-medium uppercase">
          Conferência de Caixa: {filial}
        </h3>
        <Button
          variant={"destructive"}
          className="flex gap-1.5 "
          onClick={() =>
            openModalOcorrencias({ ocorrencias_nao_resolvidas: true })
          }
        >
          <TbAlertTriangle size={22} />
          Ocorrências
        </Button>
      </div>
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
      <ModalOcorrencias id_filial={id_filial} />
    </section>
  );
};

export default Caixas;
