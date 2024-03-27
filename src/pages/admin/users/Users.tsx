
import DataTable from "./table/DataTable";
import Filters from "./table/Filters";
import { useUsers } from "./table/fetch-users";
import { columnsTableUsers } from "./table/users-columns";

const Users = () => {
    const { data, refetch} =  useUsers().getAll()
    const rows = data?.data?.rows || []
    const rowCount = data?.data?.rowCount || 0

    return ( <div>
        <Filters refetch={refetch}/>
        <DataTable data={rows} rowCount={rowCount} columns={columnsTableUsers}/>
    </div> );
}
 
export default Users;