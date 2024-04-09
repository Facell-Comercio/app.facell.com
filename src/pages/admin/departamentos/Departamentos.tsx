
import Filters from "./table/Filters";
import { columnsTableDepartamentos } from "./table/departamentos-columns";
import { DataTable } from "@/components/custom/DataTable";
import { useStoreDepartamentos } from "./table/store-table";
import { useStoreDepartamento } from "./departamento/store";
import { useDepartamentos } from "@/hooks/useDepartamentos";
import { Button } from "@/components/ui/button";
import ModalDepartamento from "./departamento/Modal";

const Departamentos = () => {
    const [pagination, setPagination, filters] = useStoreDepartamentos(state => [state.pagination, state.setPagination, state.filters])
    const { data, refetch } = useDepartamentos().getAll({ pagination, filters })
    const rows = data?.data?.rows || []
    const rowCount = data?.data?.rowCount || 0

    const openModal = useStoreDepartamento().openModal;
    const editModal = useStoreDepartamento().editModal;

    function handleClickNew() {
        openModal("");
        editModal(true);
    }

    return (<div>
        <div className="flex justify-end mb-3">
            <Button variant={"secondary"} onClick={handleClickNew}>
                Novo Departamento
            </Button>
        </div>
        <Filters refetch={refetch} />
        <ModalDepartamento/>
        <DataTable pagination={pagination} setPagination={setPagination} data={rows} rowCount={rowCount} columns={columnsTableDepartamentos} />
    </div>);
}

export default Departamentos;