import { Button } from "@/components/ui/button";
import { useStoreTablePagar } from "./table-titulos/store-table";
// import { useStoreTitulo } from "./titulo/store-titulo";
import { useTituloPagar } from "@/hooks/useTituloPagar";
import FilterFornecedores from "./FilterFornecedores";
import { TableFornecedores } from "./table-titulos/TableFornecedores";
import { columnsTableTitulos } from "./table-titulos/columns-table";
import ModalFornecedores from "./titulo/ModalFornecedores";
import { useStoreFornecedor } from "./titulo/store-fornecedor";

const SectionFornecedores = () => {
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

  const setModalFornecedorIsOpen = useStoreFornecedor().setModalFornecedorIsOpen

  const { data } = useTituloPagar().useGetAll({ pagination, filters })

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-3xl font-medium">Fornecedores</h2>
      <FilterFornecedores/>
      <Button variant={"secondary"} onClick={() => setModalFornecedorIsOpen({ open: true, id_titulo: "" })}>Novo Fornecedor</Button>
      {/* @ts-expect-error rows doestn't exists*/}
      <TableFornecedores columns={columnsTableTitulos} data={data?.data?.rows || []} rowCount={data?.data?.rowCount} />
      <ModalFornecedores />
    </div>
  );
};

export default SectionFornecedores;
