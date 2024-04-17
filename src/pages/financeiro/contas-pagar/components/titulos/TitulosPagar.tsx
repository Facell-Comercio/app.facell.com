import { useStoreTablePagar } from "./table/store-table";
// import { useStoreTitulo } from "./titulo/store-titulo";
import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { useTituloPagar } from "@/hooks/useTituloPagar";
import FiltersLancamentosPagar from "./FiltersTitulosPagar";
import { columnsTable } from "./table/columns";
import ModalTituloPagar from "./titulo/Modal";
import { useStoreTitulo } from "./titulo/store";

const TitulosPagar = () => {
  console.log("RENDER - Section-Titulos");

  const [pagination, setPagination, filters] = useStoreTablePagar((state) => [
    state.pagination,
    state.setPagination,
    state.filters,
  ]);
  const { data, refetch } = useTituloPagar().getAll({ pagination, filters });

  const rows = data?.data?.rows || [];
  const rowCount = data?.data?.rowCount || 0;

  const openModal = useStoreTitulo().openModal;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button variant={"secondary"} onClick={() => openModal("")}>
          Novo Título
        </Button>
      </div>
      <FiltersLancamentosPagar refetch={refetch} />
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
      />
      <ModalTituloPagar />
    </div>
  );
};

export default TitulosPagar;
