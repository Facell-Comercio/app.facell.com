import { useStoreTablePagar } from "./table-titulos/store-table";
// import { useStoreTitulo } from "./titulo/store-titulo";
import { useTituloPagar } from "@/hooks/use-titulo-pagar";
import { TableTitulos } from "./table-titulos/TableTitulos";
import { columnsTableTitulos } from "./table-titulos/columns-table";


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

  const { data } = useTituloPagar().getAll({ pagination, filters })

  return (
    <div>
      {/* @ts-ignore */}
      <TableTitulos columns={columnsTableTitulos} data={data?.data?.rows || []} />
    </div>
  );
};

export default SectionTitulosPagar;
