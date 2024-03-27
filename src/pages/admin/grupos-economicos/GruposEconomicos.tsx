
import { useGrupoEconomico } from "@/hooks/useGrupoEconomico";
import DataTable from "./table/DataTable";
import Filters from "./table/Filters";
import { columns } from "./table/columns";

const GruposEconomicos = () => {
    const { data, refetch} =  useGrupoEconomico().getAll()
    const rows = data?.data?.rows || []
    const rowCount = data?.data?.rowCount || 0

    return ( <div>
        <Filters refetch={refetch}/>
        <DataTable data={rows} rowCount={rowCount} columns={columns}/>
    </div> );
}
 
export default GruposEconomicos;