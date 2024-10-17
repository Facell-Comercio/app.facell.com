import { DataTable } from "@/components/custom/DataTable";
import { Input } from "@/components/custom/FormInput";
import SearchComponent from "@/components/custom/SearchComponent";
import SelectMes from "@/components/custom/SelectMes";
import { useMailing } from "@/hooks/marketing/useMailing";
import ModalCampanha from "./campanha/Modal";
import { columnsTable } from "./table/columns";
import { useStoreTableCampanhas } from "./table/store-table";

const Campanhas = () => {
  const [filters, setFilters, pagination, setPagination] = useStoreTableCampanhas((state) => [
    state.filters,
    state.setFilters,
    state.pagination,
    state.setPagination,
  ]);
  const { data, isLoading, isSuccess } = useMailing().getCampanhas({
    filters,
  });

  const rows = data?.rows || [];
  const rowCount = data?.rowCount || 0;

  return (
    <div className="flex flex-col gap-3 ">
      <span className="flex gap-3">
        <SelectMes value={filters.mes} onValueChange={(mes) => setFilters({ mes })} />
        <Input
          type="number"
          min={2023}
          max={new Date().getFullYear() + 1}
          value={filters.ano}
          onChange={(e) => setFilters({ ano: e.target.value })}
        />
      </span>
      <SearchComponent handleSearch={(search) => setFilters({ nome: search })} />
      {isSuccess && (
        <DataTable
          pagination={pagination}
          setPagination={setPagination}
          data={rows}
          showRowCount
          rowCount={rowCount}
          columns={columnsTable}
          isLoading={isLoading}
        />
      )}
      <ModalCampanha />
    </div>
  );
};

export default Campanhas;
