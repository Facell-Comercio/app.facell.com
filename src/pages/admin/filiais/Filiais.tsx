import { useFilial } from "@/hooks/useFilial";
import Filters from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreFiliais } from "./table/store-table";
import { useStoreFilial } from "./filial/store";
import { DataTable } from "@/components/custom/DataTable";
import ModalFilial from "./filial/Modal";
import { Button } from "@/components/ui/button";

const Filiais = () => {
    const [pagination, setPagination, filters] = useStoreFiliais(state=>([state.pagination, state.setPagination, state.filters]))
    const { data, refetch} =  useFilial().getAll({pagination, filters})
    const rows = data?.data?.rows || []
    const rowCount = data?.data?.rowCount || 0

    const openModal = useStoreFilial().openModal;
    const editModal = useStoreFilial().editModal;

    function handleClickNew() {
        openModal("");
        editModal(true);
    }

    return ( <div>
        <div className="flex justify-end mb-3">
            <Button variant={"secondary"} onClick={handleClickNew}>
                Nova Filial
            </Button>
        </div>
        <Filters refetch={refetch}/>
        <ModalFilial/>
        <DataTable pagination={pagination} setPagination={setPagination} data={rows} rowCount={rowCount} columns={columnsTable}/>
    </div> );
}
 
export default Filiais;