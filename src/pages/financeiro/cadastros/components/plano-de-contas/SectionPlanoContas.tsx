import { Button } from "@/components/ui/button";
import { useFornecedores } from "@/hooks/useFornecedores";
import FilterFornecedores from "../fornecedores/FilterFornecedores";
import ModalFornecedor from "../fornecedores/fornecedor/ModalFornecedor";
import { TableFornecedores } from "../fornecedores/table-fornecedores/TableFornecedores";
import { columnsTableTitulos } from "../fornecedores/table-fornecedores/columns-table";
import { useStorePlanoContas } from "./plano-conta/store-plano-contas";
import { useStoreTablePlanoContas } from "./table-plano-contas/store-table";

const SectionPlanoContas = () => {
  console.log('RENDER - Section-Titulos')

  const {
    pagination,
    filters,
  } = useStoreTablePlanoContas(state => ({
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

  const openModal = useStorePlanoContas().openModal

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

export default SectionPlanoContas;
