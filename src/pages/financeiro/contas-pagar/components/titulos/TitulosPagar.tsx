import { useStoreTablePagar } from "./table/store-table";
// import { useStoreTitulo } from "./titulo/store-titulo";
import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  checkUserDepartments,
  checkUserPermission,
} from "@/helpers/checkAuthorization";
import { useTituloPagar } from "@/hooks/useTituloPagar";
import { Download, Edit, Plus, Repeat2 } from "lucide-react";
import FiltersLancamentosPagar from "./FiltersTitulosPagar";
import ModalAlteracoesLote from "./alteracao-lote/Modal";
import { useStoreAlteracoesLote } from "./alteracao-lote/store";
import ModalRecorrencias from "./recorrencias/Modal";
import { useStoreRecorrencias } from "./recorrencias/store";
import { columnsTable } from "./table/columns";
import ModalTituloPagar from "./titulo/Modal";
import { useStoreTitulo } from "./titulo/store";

const TitulosPagar = () => {
  console.log("RENDER - Section-Titulos");
  const isMaster =
    checkUserDepartments("FINANCEIRO") || checkUserPermission("MASTER");

  const [pagination, setPagination, filters] = useStoreTablePagar((state) => [
    state.pagination,
    state.setPagination,
    state.filters,
  ]);
  const [rowSelection, handleRowSelection, idSelection] = useStoreTablePagar((state) => [
    state.rowSelection,
    state.handleRowSelection,
    state.idSelection,
  ]);
  
  const { data, refetch } = useTituloPagar().getAll({ pagination, filters });

  const rows = data?.data?.rows || [];
  const rowCount = data?.data?.rowCount || 0;

  const openModal = useStoreTitulo().openModal;
  const openModalRecorrencias = useStoreRecorrencias().openModal;
  const openModalAlteracoesLote = useStoreAlteracoesLote().openModal;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap justify-end gap-3 ">
        {isMaster && (
          <Button
            variant={"outline"}
            className="border border-orange-200 dark:border-orange-600"
            onClick={() => openModalAlteracoesLote("")}
          >
            <Edit className="me-2" size={18} /> Alterar em lote
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            className="py-2 px-4 border border-emerald-200 dark:border-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm flex font-medium gap-2 items-center rounded-lg"
          >
            <Download className="me-2" size={18} /> Exportar
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Solicitações</DropdownMenuItem>
            <DropdownMenuItem>Para o Datasys</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Anexos</DropdownMenuLabel>
              <DropdownMenuItem>Boleto</DropdownMenuItem>
              <DropdownMenuItem>Nota fiscal</DropdownMenuItem>
              <DropdownMenuItem>Contrato/Autorização</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant={"outline"} onClick={() => openModalRecorrencias("")}>
          <Repeat2 className="me-2" size={18} /> Recorrências
        </Button>
        <Button
          variant={"outline"}
          className="border-blue-200 dark:border-primary"
          onClick={() => openModal("")}
        >
          <Plus className="me-2" size={18} /> Nova Solicitação
        </Button>
      </div>
      <FiltersLancamentosPagar refetch={refetch} />
      
      <DataTable
        pagination={pagination}
        setPagination={setPagination}
        rowSelection={rowSelection}
        handleRowSelection={handleRowSelection}
        data={rows}
        rowCount={rowCount}
        columns={columnsTable}
      />
      <ModalTituloPagar />
      <ModalRecorrencias />
      <ModalAlteracoesLote />
    </div>
  );
};

export default TitulosPagar;
