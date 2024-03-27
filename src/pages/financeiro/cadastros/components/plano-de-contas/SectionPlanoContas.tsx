import { Button } from "@/components/ui/button";
import { usePlanoContas } from "@/hooks/usePlanoConta";
import FiltersPlanoContas from "./FilterPlanoContas";
import ModalPlanoContas from "./plano-conta/ModalPlanoContas";
import { useStorePlanoContas } from "./plano-conta/store-plano-contas";
import { TablePlanoContas } from "./table-plano-contas/TablePlanoContas";
import { columnsTablePlanoContas } from "./table-plano-contas/columns-table";
import { useStoreTablePlanoContas } from "./table-plano-contas/store-table";

const SectionPlanoContas = () => {
  console.log('RENDER - Section-Plano Contas')

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
  const editModal = useStorePlanoContas().editModal

  function handleClickNewConta(){
    openModal("")
    editModal(true)
  }

  const { data, refetch } = usePlanoContas().useGetAll({ pagination, filters })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between">
        <h2 className="text-3xl font-medium">Planos de Contas</h2>
        <Button variant={"secondary"} onClick={handleClickNewConta}>Novo Plano de Contas</Button>
      </div>
      <FiltersPlanoContas refetch={refetch}/>
      {/* @ts-expect-error rows doestn't exists*/}
      <TablePlanoContas columns={columnsTablePlanoContas} data={data?.data?.rows || []} rowCount={data?.data?.rowCount} />
      <ModalPlanoContas />
    </div>
  );
};

export default SectionPlanoContas;
