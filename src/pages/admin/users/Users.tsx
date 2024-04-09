

import { DataTable } from "@/components/custom/DataTable";
import Filters from "./table/FiltersUsers";
import { useUsers } from "./table/fetch-users";
import { columnsTableUsers } from "./table/columns-users";
import { useStoreUsers } from "./table/store-table";
import { useStoreUser } from "./user/store";
import ModalUser from "./user/Modal";
import { Button } from "@/components/ui/button";

const Users = () => {
  const { data, refetch } = useUsers().getAll()
  const [pagination, setPagination] = useStoreUsers(state => [state.pagination, state.setPagination])
  const rows = data?.data?.rows || []
  const rowCount = data?.data?.rowCount || 0

  const openModal = useStoreUser().openModal;
  const editModal = useStoreUser().editModal;

  function handleClickNewUser() {
    openModal("");
    editModal(true);
  }

  return (<div>
    <div className="flex justify-end mb-3">
      <Button variant={"secondary"} onClick={handleClickNewUser}>
        Novo Usuário
      </Button>
    </div>
    <Filters refetch={refetch} />
    <ModalUser />
    <DataTable pagination={pagination} setPagination={setPagination} data={rows} rowCount={rowCount} columns={columnsTableUsers} />
  </div>);
}

export default Users;