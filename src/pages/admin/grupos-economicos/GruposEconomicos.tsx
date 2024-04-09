
import { useGrupoEconomico } from "@/hooks/useGrupoEconomico";
import Filters from "./table/Filters";
import { columns } from "./table/columns";
import { DataTable } from "@/components/custom/DataTable";
import { useStoreGruposEconomicos } from "./table/store-table-grupos";
import { useStoreGrupoEconomico } from "./grupo-economico/store";
import Modal from "./grupo-economico/Modal";
import { Button } from "@/components/ui/button";

const GruposEconomicos = () => {
    const [pagination, setPagination, filters] = useStoreGruposEconomicos(state=>[state.pagination, state.setPagination, state.filters])
    const { data, refetch} =  useGrupoEconomico().getAll({pagination, filters})
    const rows = data?.data?.rows || []
    const rowCount = data?.data?.rowCount || 0

    const openModal = useStoreGrupoEconomico().openModal;
    const editModal = useStoreGrupoEconomico().editModal;

    function handleClickNew() {
        openModal("");
        editModal(true);
    }

    return ( <div>
        <div className="flex justify-end mb-3">
            <Button variant={"secondary"} onClick={handleClickNew}>
                Novo Grupo Econômico
            </Button>
        </div>
        <Filters refetch={refetch}/>
        <Modal/>
        <DataTable pagination={pagination} setPagination={setPagination} data={rows} rowCount={rowCount} columns={columns}/>
    </div> );
}
 
export default GruposEconomicos;