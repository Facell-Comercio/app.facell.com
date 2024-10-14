import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMailing } from "@/hooks/marketing/useMailing";
import { Plus } from "lucide-react";
import ModalNovaCampanha from "./nova-campanha/Modal";
import { useStoreNovaCampanha } from "./nova-campanha/store";
import { columnsTable } from "./table/columns";
import FilterClientes from "./table/Filters";
import { useStoreTableClientes } from "./table/store-table";

const Clientes = () => {
  const [pagination, setPagination, filters] = useStoreTableClientes((state) => [
    state.pagination,
    state.setPagination,
    state.filters,
  ]);
  const openModalCampanha = useStoreNovaCampanha().openModal;
  const { data, refetch, isLoading, isSuccess } = useMailing().getClientes({
    pagination,
    filters,
  });

  const rows = data?.rows || [];
  const rowCount = data?.rowCount || 0;
  const defaultFilters = data?.filters || {};

  return (
    <div className="flex flex-col gap-3 ">
      {isLoading ? (
        <section className="grid grid-cols-[240px_1fr] max-w-full gap-2 h-[80vh] max-h-full">
          <Skeleton className="w-full h-full" />
          <Skeleton className="w-full h-full" />
        </section>
      ) : (
        <>
          <div className="flex justify-end w-full">
            <Button
              variant={"outline"}
              className="border-primary w-fit"
              onClick={() => openModalCampanha(parseFloat(rowCount))}
            >
              <Plus className="me-2" />
              Criar Campanha
            </Button>
          </div>
          <section className="grid grid-cols-[240px_1fr] max-w-full gap-2 max-h-full">
            {isSuccess && (
              <FilterClientes refetch={refetch} defaultFiltersFetched={defaultFilters} />
            )}
            <div className=" overflow-y-auto max-h-full scroll-thin">
              <DataTable
                pagination={pagination}
                setPagination={setPagination}
                data={rows}
                rowCount={rowCount}
                columns={columnsTable}
                isLoading={isLoading}
              />
            </div>
          </section>
          <ModalNovaCampanha />
        </>
      )}
    </div>
  );
};

export default Clientes;
