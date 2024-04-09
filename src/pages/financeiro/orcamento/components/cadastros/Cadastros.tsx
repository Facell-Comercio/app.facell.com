import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { useOrcamento } from "@/hooks/useOrcamento";
import { Download, Upload } from "lucide-react";
import ModalCadastro from "./cadastro/Modal";
import { useStoreCadastro } from "./cadastro/store";
import FilterCadastros from "./table/Filters";
import { columnsTable } from "./table/columns";
import { useStoreTableCadastro } from "./table/store-table";

const Cadastros = () => {
  console.log("RENDER - Section-Titulos");
  const [pagination, setPagination, filters] = useStoreTableCadastro(
    (state) => [state.pagination, state.setPagination, state.filters]
  );
  const { data, refetch } = useOrcamento().getAll({
    pagination,
    filters,
  });
  const rows = data?.data?.rows || [];
  const rowCount = data?.data?.rowCount || 0;

  const openModal = useStoreCadastro().openModal;
  function handleClickNewCadastro() {
    openModal("");
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant={"outline"} onClick={handleClickNewCadastro}>
            <Upload className="me-2" size={20} />
            Exportar
          </Button>
          <Button variant={"outline"} onClick={handleClickNewCadastro}>
            <Download className="me-2" size={20} />
            Importar
          </Button>
        </div>
        <Button variant={"secondary"} onClick={handleClickNewCadastro}>
          Novo Item
        </Button>
      </div>
      <FilterCadastros refetch={refetch} />
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
      />
      <ModalCadastro />
    </div>
  );
};

export default Cadastros;
