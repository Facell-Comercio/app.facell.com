import { exportToExcel } from "@/helpers/importExportXLS";
import { api } from "@/lib/axios";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStoreTablePagar } from "../table/store-table";
import { Download } from "lucide-react";


const ButtonExportTitulos = () => {
  const [filters] = useStoreTablePagar((state) => [
    state.filters,
  ]);
  
  async function exportSolicitacao() {
    const response = await api.get(`/financeiro/contas-a-pagar/titulo`, {
      params: { filters },
    });
    exportToExcel(response?.data?.rows || [], `solicitacoes`);
  }

    return ( 
        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            className="py-2 px-4 border border-emerald-200 dark:border-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm flex font-medium gap-2 items-center rounded-md"
          >
            <Download className="me-2" size={18} /> Exportar
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={exportSolicitacao}>
              Solicitações
            </DropdownMenuItem>
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
     );
}
 
export default ButtonExportTitulos;