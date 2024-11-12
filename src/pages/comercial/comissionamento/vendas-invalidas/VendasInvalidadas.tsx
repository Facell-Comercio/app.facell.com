import { DataTable } from "@/components/custom/DataTable";

import { Input } from "@/components/custom/FormInput";
import SelectMes from "@/components/custom/SelectMes";
import { useVendasInvalidadas } from "@/hooks/comercial/useVendasInvalidadas";
import ButtonExcluir from "./components/ButtonExcluir";
import ButtonProcessar from "./components/ButtonProcessar";
import { columnsTable } from "./table/columns";
import FiltersVendasInvalidadas from "./table/Filters";
import { useStoreTableVendasInvalidadas } from "./table/store-table";
import ModalVendaInvalidada from "./venda-invalida/Modal";

const VendasInvalidadas = () => {
  const [pagination, setPagination, filters, mes, setMes, ano, setAno] =
    useStoreTableVendasInvalidadas((state) => [
      state.pagination,
      state.setPagination,
      state.filters,

      state.mes,
      state.setMes,
      state.ano,
      state.setAno,
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
      <div className="flex gap-2 justify-between">
        <span className="flex gap-2">
          <SelectMes value={mes} onValueChange={setMes} className="w-[180px]" />
          <Input
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            className="w-[12ch]"
            type="number"
            min={2023}
          />
        </span>
        <span className="flex gap-2">
          <ButtonProcessar />
          <ButtonExcluir />
        </span>
      </div>
      <FiltersVendasInvalidadas refetch={refetch} />
      {/* <div className="flex gap-2 justify-end">
        {checkUserPermission([
          "GERENCIAR_VENDASINVALIDadAS",
          "MASTER",
        ]) && <ButtonImportMeta />}
        {checkUserPermission([
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
