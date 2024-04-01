

import { DataTable } from "@/components/custom/DataTable";
import Filters from "./table/FiltersUsers";
import { useUsers } from "./table/fetch-users";
import { columnsTableUsers } from "./table/columns-users";
import { useStoreUsers } from "./table/store-table";

const Users = () => {
    const { data, refetch} =  useUsers().getAll()
    const [pagination, setPagination] = useStoreUsers(state=>[state.pagination, state.setPagination])
    const rows = data?.data?.rows || []
    const rowCount = data?.data?.rowCount || 0

    return ( <div>
        <Filters refetch={refetch}/>
        <DataTable pagination={pagination} setPagination={setPagination} data={rows} rowCount={rowCount} columns={columnsTableUsers}/>
    </div> );
}
 
export default Users;