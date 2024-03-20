import { useStoreTablePagar } from "./table-titulos/store-table";
// import { useStoreTitulo } from "./titulo/store-titulo";
import { useTituloPagar } from "@/hooks/useTituloPagar";
import FiltersLancamentosPagar from "./FiltersTitulosPagar";
import { TableTitulos } from "./table-titulos/TableTitulos";
import { columnsTableTitulos } from "./table-titulos/columns-table";
import ModalTituloPagar from "./titulo/ModalTituloPagar";

const SectionTitulosPagar = () => {
  console.log('RENDER - Section-Titulos')

  const {
    pagination,
    filters,
  } = useStoreTablePagar(state => ({
    rowCount: state.rowCount,
    filters: state.filters,
    pagination: state.pagination,
    setPagination: state.setPagination,
    sorting: state.sorting,
    setSorting: state.setSorting,
    rowSelection: state.rowSelection,
    setRowSelection: state.setRowSelection,
    isAllSelected: state.isAllSelected
  }))

  const { data, refetch } = useTituloPagar().useGetAll({ pagination, filters })

  return (
    <div>
      <FiltersLancamentosPagar refetch={refetch} />
      {/* @ts-expect-error rows doestn't exists*/}
      <TableTitulos columns={columnsTableTitulos} data={data?.data?.rows || []} rowCount={data?.data?.rowCount} />
      <ModalTituloPagar />
    </div>
  );
};

export default SectionTitulosPagar;
