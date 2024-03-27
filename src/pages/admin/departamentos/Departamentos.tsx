
import DataTable from "./table/DataTable";
import Filters from "./table/Filters";
import { useDepartamentos } from "./table/fetch-departamentos";
import { columnsTableDepartamentos } from "./table/departamentos-columns";

const Departamentos = () => {
    const { data, refetch} =  useDepartamentos().getAll()
    const rows = data?.data?.rows || []
    const rowCount = data?.data?.rowCount || 0

    return ( <div>
        <Filters refetch={refetch}/>
        <DataTable data={rows} rowCount={rowCount} columns={columnsTableDepartamentos}/>
    </div> );
}
 
export default Departamentos;