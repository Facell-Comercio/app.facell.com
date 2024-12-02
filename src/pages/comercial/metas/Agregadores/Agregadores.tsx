import { DataTable } from "@/components/custom/DataTable";

import { hasPermission } from "@/helpers/checkAuthorization";

import { useAgregadores } from "@/hooks/comercial/useAgregadores";
import { useStoreMetasAgregadores } from "../store-metas-agregadores";
import ModalMeta from "./agregador/Modal";
import ButtonExportMeta from "./components/ButtonExportAgregadores";
import ButtonImportMeta from "./components/ButtonImportAgregador";
import ButtonNovoAgregador from "./components/ButtonNovoAgregador";
import { columnsTable } from "./table/columns";
import FiltersMeta from "./table/Filters";
import { useStoreTableAgregadores } from "./table/store-table";

const Agregadores = () => {
  const [pagination, setPagination, filters] = useStoreTableAgregadores((state) => [
    state.pagination,
    state.setPagination,
    state.filters,
  ]);
  const [mes, ano] = useStoreMetasAgregadores((state) => [state.mes, state.ano]);
  const { data, refetch, isLoading } = useAgregadores().getAll({
    pagination,
    filters: {
      ...filters,
      mes,
      ano,
    },
  });

  const rows = data?.rows || [];

  const rowCount = data?.rowCount || 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 justify-end flex-wrap">
        {hasPermission(["METAS:AGREGADORES_GERAR", "MASTER"]) && <ButtonImportMeta />}
        <ButtonExportMeta />
        {hasPermission(["METAS:AGREGADORES_GERAR", "MASTER"]) && <ButtonNovoAgregador />}
      </div>
      <FiltersMeta refetch={refetch} />

      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
        isLoading={isLoading}
      />
      <ModalMeta />
    </div>
  );
};

export default Agregadores;
