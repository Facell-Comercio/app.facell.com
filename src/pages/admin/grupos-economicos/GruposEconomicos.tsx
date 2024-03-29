
import { useGrupoEconomico } from "@/hooks/useGrupoEconomico";
import Filters from "./table/Filters";
import { columns } from "./table/columns";
import { DataTable } from "@/components/custom/DataTable";
import { useStoreGruposEconomicos } from "./table/store-table-grupos";

const GruposEconomicos = () => {
    const [pagination, setPagination] = useStoreGruposEconomicos(state=>[state.pagination, state.setPagination])
    const { data, refetch} =  useGrupoEconomico().getAll()
    const rows = data?.data?.rows || []
    const rowCount = data?.data?.rowCount || 0

    return ( <div>
        <Filters refetch={refetch}/>
        <DataTable pagination={pagination} setPagination={setPagination} data={rows} rowCount={rowCount} columns={columns}/>
    </div> );
}
 
export default GruposEconomicos;