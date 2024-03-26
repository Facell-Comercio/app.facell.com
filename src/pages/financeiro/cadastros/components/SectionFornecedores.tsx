import { Button } from "@/components/ui/button";
import { useStoreTableFornecedor } from "./table-titulos/store-table";
// import { useStoreTitulo } from "./titulo/store-titulo";
import { useFornecedores } from "@/hooks/useFornecedores";
import FilterFornecedores from "./FilterFornecedores";
import { TableFornecedores } from "./table-titulos/TableFornecedores";
import { columnsTableTitulos } from "./table-titulos/columns-table";
import ModalFornecedor from "./titulo/ModalFornecedor";
import { useStoreFornecedor } from "./titulo/store-fornecedor";

const SectionFornecedores = () => {
  console.log('RENDER - Section-Titulos')

  const {
    pagination,
    filters,
  } = useStoreTableFornecedor(state => ({
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

  const openModal = useStoreFornecedor().openModal

  const { data, refetch } = useFornecedores().useGetAll({ pagination, filters })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between">
        <h2 className="text-3xl font-medium">Fornecedores</h2>
        <Button variant={"secondary"} onClick={() => openModal("")}>Novo Fornecedor</Button>
      </div>
      <FilterFornecedores refetch={refetch}/>
      {/* @ts-expect-error rows doestn't exists*/}
      <TableFornecedores columns={columnsTableTitulos} data={data?.data?.rows || []} rowCount={data?.data?.rowCount} />
      <ModalFornecedor />
    </div>
  );
};

export default SectionFornecedores;