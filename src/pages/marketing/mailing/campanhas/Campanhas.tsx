import { DataTable } from "@/components/custom/DataTable";
import { Input } from "@/components/custom/FormInput";
import SearchComponent from "@/components/custom/SearchComponent";
import SelectMes from "@/components/custom/SelectMes";
import { Button } from "@/components/ui/button";
import { useMailing } from "@/hooks/marketing/useMailing";
import { RefreshCcw } from "lucide-react";
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
  const { mutate: reimportarEvolux, isPending: reimportarEvoluxIsPending } =
    useMailing().reimportarEvolux();

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
        <Button
          onClick={() => {
            reimportarEvolux({ from: new Date(), to: new Date() });
          }}
          disabled={reimportarEvoluxIsPending}
          title="Importa as ligações realizadas no dia atual"
        >
          {reimportarEvoluxIsPending ? (
            <>
              <RefreshCcw size={18} className="me-2 animate-spin" />
              Importando...
            </>
          ) : (
            <>
              <RefreshCcw className="me-2" size={18} /> Importar Evolux
            </>
          )}
        </Button>
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
