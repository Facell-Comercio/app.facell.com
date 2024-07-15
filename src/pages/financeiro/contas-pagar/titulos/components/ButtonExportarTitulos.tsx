import { api } from "@/lib/axios";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToExcel } from "@/helpers/importExportXLS";
import { Download } from "lucide-react";
import { useStoreExportDatasys } from "../export-datasys/store";
import { useStoreTablePagar } from "../table/store-table";

export type ExportAnexosProps = {
  type: string;
  idSelection: number[];
};

const ButtonExportTitulos = () => {
  const openModalExportDatasys = useStoreExportDatasys().openModal;
  const [filters] = useStoreTablePagar((state) => [
    state.filters,
  ]);

  async function exportSolicitacao() {
    const response = await api.get(`/financeiro/contas-a-pagar/titulo/`, {
      params: { filters },
    });
    exportToExcel(response?.data?.rows || [], `SOLICITAÇÕES`);
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
          Layout Padrão
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openModalExportDatasys("")}>
          Layout Datasys
        </DropdownMenuItem>
        <DropdownMenuItem>
          <a target="_blank" href="https://docs.google.com/spreadsheets/d/1xQXNc7i27msUu3W72tBmdniDZMa_82Hr/export?format=xlsx">Planilha Padrão Importação</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ButtonExportTitulos;
