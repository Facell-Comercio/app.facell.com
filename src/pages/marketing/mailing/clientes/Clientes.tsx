import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { useMailing } from "@/hooks/marketing/useMailing";
import { lastDayOfMonth, subYears } from "date-fns";
import { Plus, Smartphone } from "lucide-react";
import ModalNovaCampanha from "./nova-campanha/Modal";
import { useStoreNovaCampanha } from "./nova-campanha/store";
import { columnsTable } from "./table/columns";
import FilterClientes from "./table/Filters";
import { useStoreTableClientes } from "./table/store-table";

const Clientes = () => {
  const [pagination, setPagination, filters, setFilters] = useStoreTableClientes((state) => [
    state.pagination,
    state.setPagination,
    state.filters,
    state.setFilters,
  ]);
  const openModalCampanha = useStoreNovaCampanha().openModal;
  const { data, refetch, isLoading, isFetching } = useMailing().getClientes({
    pagination,
    filters,
  });

  const handleSetDefaultSmartphoneFilter = async () => {
    await new Promise((resolve) =>
      resolve(
        setFilters({
          nao_desativado: 1,
          grupo_estoque_list: ["APARELHO"],
          range_data_pedido: {
            from: new Date(subYears(lastDayOfMonth(new Date()), 1)),
            to: undefined,
          },
          produtos_cliente: ["com_gsm"],
          valor_desconto_minimo: "0.001",
        })
      )
    );
    refetch();
  };

  const rows = data?.rows || [];
  const rowCount = data?.rowCount || 0;
  const defaultFilters = data?.filters || {};

  return (
    <div className="flex flex-col gap-3 ">
      <div className="flex gap-2 justify-end w-full">
        <Button
          variant={"outline"}
          className="border-success w-fit"
          onClick={handleSetDefaultSmartphoneFilter}
        >
          <Smartphone className="me-2" />
          Filtro Padrão Aparelhos
        </Button>
        <Button
          variant={"outline"}
          className="border-primary w-fit"
          onClick={() => openModalCampanha(parseFloat(rowCount))}
        >
          <Plus className="me-2" />
          Criar Campanha
        </Button>
      </div>
      <section className="grid sm:grid-cols-[240px_1fr] max-w-full gap-2 max-h-full transition-all">
        <FilterClientes
          refetch={refetch}
          defaultFiltersFetched={defaultFilters}
          isLoading={isLoading || isFetching}
        />

        <div className="flex flex-col gap-2 overflow-y-auto max-h-full scroll-thin">
          {isFetching && (
            <div
              className={
                "flex items-center justify-center text-xs font-medium text-foreground animate-pulse bg-secondary w-full min-h-4 p-0.5 rounded-full border"
              }
            >
              Carregando...
            </div>
          )}
          <DataTable
            pagination={pagination}
            setPagination={setPagination}
            data={rows}
            showRowCount
            rowCount={rowCount}
            columns={columnsTable}
            isLoading={isLoading || isFetching}
          />
        </div>
      </section>
      <ModalNovaCampanha />
    </div>
  );
};

export default Clientes;
