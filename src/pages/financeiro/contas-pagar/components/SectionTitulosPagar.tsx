import { useStoreTablePagar } from "./table-titulos/store-table";
// import { useStoreTitulo } from "./titulo/store-titulo";
import { Button } from "@/components/ui/button";
import { useTituloPagar } from "@/hooks/useTituloPagar";
import FiltersLancamentosPagar from "./FiltersTitulosPagar";
import { TableTitulos } from "./table-titulos/TableTitulos";
import { columnsTableTitulos } from "./table-titulos/columns-table";
import ModalTituloPagar from "./titulo/ModalTituloPagar";
import { useStoreTitulo } from "./titulo/store-titulo";

const SectionTitulosPagar = () => {
  console.log('RENDER - Section-Titulos')

  const {
    pagination,
    filters,
  } = useStoreTablePagar(state => ({
    filters: state.filters,
    pagination: state.pagination,
  }))

  const openModal = useStoreTitulo().openModal

  const { data, refetch } = useTituloPagar().useGetAll({ pagination, filters })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button variant={"secondary"} onClick={() => openModal("")}>Novo Título</Button>
      </div>
      <FiltersLancamentosPagar refetch={refetch} />
      {/* @ts-expect-error rows doestn't exists*/}
      <TableTitulos columns={columnsTableTitulos} data={data?.data?.rows || []} rowCount={data?.data?.rowCount} />
      <ModalTituloPagar />
    </div>
  );
};

export default SectionTitulosPagar;
