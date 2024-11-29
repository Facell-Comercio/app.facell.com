import { DataTable } from "@/components/custom/DataTable";

import { useVendasInvalidadas } from "@/hooks/comercial/useVendasInvalidadas";
import ButtonAlteracaoLote from "./components/ButtonAlteracaoLote";
import ButtonExcluir from "./components/ButtonExcluir";
import ButtonGerarVales from "./components/ButtonGerarVales";
import ButtonProcessar from "./components/ButtonProcessar";
import { columnsTable } from "./table/columns";
import FiltersVendasInvalidadas from "./table/Filters";
import { useStoreTableVendasInvalidadas } from "./table/store-table";
import ModalVendaInvalidada from "./venda-invalida/Modal";

const VendasInvalidadas = () => {
  const [pagination, setPagination, filters, mes, ano] = useStoreTableVendasInvalidadas((state) => [
    state.pagination,
    state.setPagination,
    state.filters,

    state.mes,
    state.ano,
  ]);

  const { data, refetch, isLoading } = useVendasInvalidadas().getAll({
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
      <div className="flex gap-2 justify-end">
        <ButtonAlteracaoLote />
        <ButtonProcessar />
        <ButtonExcluir />
        <ButtonGerarVales />
      </div>
      <FiltersVendasInvalidadas refetch={refetch} />
      {/* <div className="flex gap-2 justify-end">
        {hasPermission([
          "GERENCIAR_VENDASINVALIDadAS",
          "MASTER",
        ]) && <ButtonImportMeta />}
        {hasPermission([
          "GERENCIAR_VENDASINVALIDadAS",
          "MASTER",
        ]) && <ButtonNovaMeta />}
      </div> */}

      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
        isLoading={isLoading}
      />
      <ModalVendaInvalidada />
    </div>
  );
};

export default VendasInvalidadas;
