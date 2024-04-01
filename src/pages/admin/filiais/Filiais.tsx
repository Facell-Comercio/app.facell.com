import { useFilial } from "@/hooks/useFilial";
import Filters from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreFiliais } from "./table/store-table";
import { DataTable } from "@/components/custom/DataTable";

const Filiais = () => {
    const [pagination, setPagination, filters] = useStoreFiliais(state=>([state.pagination, state.setPagination, state.filters]))
    const { data, refetch} =  useFilial().getAll({pagination, filters})
    const rows = data?.data?.rows || []
    const rowCount = data?.data?.rowCount || 0

    return ( <div>
        <Filters refetch={refetch}/>
        <DataTable pagination={pagination} setPagination={setPagination} data={rows} rowCount={rowCount} columns={columnsTable}/>
    </div> );
}
 
export default Filiais;