
import { useFilial } from "@/hooks/useFilial";
import DataTable from "./table/DataTable";
import Filters from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreFiliais } from "./table/store-table";

const Filiais = () => {
    const [pagination, filters] = useStoreFiliais(state=>([state.pagination, state.filters]))
    const { data, refetch} =  useFilial().getAll({pagination, filters})
    const rows = data?.data?.rows || []
    const rowCount = data?.data?.rowCount || 0

    return ( <div>
        <Filters refetch={refetch}/>
        <DataTable data={rows} rowCount={rowCount} columns={columnsTable}/>
    </div> );
}
 
export default Filiais;