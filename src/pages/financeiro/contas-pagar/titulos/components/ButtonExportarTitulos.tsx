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
import { toast } from "@/components/ui/use-toast";
import { exportToExcel } from "@/helpers/importExportXLS";
import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { Download } from "lucide-react";
import { useStoreExportDatasys } from "../export-datasys/store";
import { useStoreTablePagar } from "../table/store-table";

export type ExportAnexosProps = {
  type: string;
  idSelection: number[];
};

const ButtonExportTitulos = () => {
  const { mutate: exportAnexo } = useTituloPagar().exportAnexo();
  const openModalExportDatasys = useStoreExportDatasys().openModal;
  const [filters, idSelection] = useStoreTablePagar((state) => [
    state.filters,
    state.idSelection,
  ]);

  async function exportSolicitacao() {
    const response = await api.get(`/financeiro/contas-a-pagar/titulo/`, {
      params: { filters },
    });
    console.log(filters);

    console.log(response?.data?.rows);

    exportToExcel(response?.data?.rows || [], `solicitacoes`);
  }

  async function exportAnexoFn(type: string) {
    if (!(idSelection && idSelection.length)) {
      toast({
        variant: "destructive",
        title: "Solicitações não selecionadas",
        description:
          "Selecione uma ou mais solicitações para realizar as alterações",
      });
      return;
    }

    exportAnexo({ type, idSelection });
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
        <DropdownMenuItem onClick={() => openModalExportDatasys("")}>
          Para o Datasys
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Anexos</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => exportAnexoFn("url_boleto")}>
            Boleto
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportAnexoFn("url_nota_fiscal")}>
            Nota fiscal
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportAnexoFn("url_contrato")}>
            Contrato/Autorização
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ButtonExportTitulos;
