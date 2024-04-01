
import Filters from "./table/Filters";
import { columnsTableDepartamentos } from "./table/departamentos-columns";
import { DataTable } from "@/components/custom/DataTable";
import { useStoreDepartamentos } from "./table/store-table";
import { useDepartamentos } from "@/hooks/useDepartamentos";

const Departamentos = () => {
    const [pagination, setPagination, filters] = useStoreDepartamentos(state=>[state.pagination, state.setPagination, state.filters])
    const { data, refetch} =  useDepartamentos().getAll({pagination, filters})
    const rows = data?.data?.rows || []
    const rowCount = data?.data?.rowCount || 0

    return ( <div>
        <Filters refetch={refetch}/>
        <DataTable  pagination={pagination} setPagination={setPagination} data={rows} rowCount={rowCount} columns={columnsTableDepartamentos}/>
    </div> );
}
 
export default Departamentos;