import { api } from "@/lib/axios";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  checkUserDepartments,
  checkUserPermission,
} from "@/helpers/checkAuthorization";
import { exportToExcel } from "@/helpers/importExportXLS";
import { normalizeDate } from "@/helpers/mask";
import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useStoreExportDatasys } from "../export-datasys/store";
import { useStoreTablePagar } from "../table/store-table";
import { TituloSchemaProps } from "../titulo/form-data";
import { Spinner } from "@/components/custom/Spinner";

export type ExportAnexosProps = {
  type: string;
  idSelection: number[];
};

interface TituloProps extends TituloSchemaProps {
  solicitante?: string;
  forma_pagamento?: string;
  fornecedor?: string;
  cnpj_fornecedor?: string;
}

const ButtonExportTitulos = () => {
  const { mutate: exportPrevisaoPagamento, isPending: isPendingPrevisaoPagamento } =
    useTituloPagar().exportPrevisaoPagamento();

  const { mutate: exportLayoutDespesas, isPending: isPedingLayoutDespesas } =
    useTituloPagar().exportLayoutDespesas();

  const { mutate: exportLayoutDRE, isPending: isPendingLayoutDRE } =
    useTituloPagar().exportLayoutDRE();

  const [isPending, setIsPending] = useState(false);
  useEffect(() => {
    if (isPendingPrevisaoPagamento ||
      isPendingLayoutDRE ||
      isPedingLayoutDespesas) {
      setIsPending(true)
    } else {
      setIsPending(false)
    }
  }, [
    isPendingPrevisaoPagamento,
    isPendingLayoutDRE,
    isPedingLayoutDespesas,
  ])

  const openModalExportDatasys = useStoreExportDatasys().openModal;

  const isMaster =
    checkUserPermission("MASTER") || checkUserDepartments("FINANCEIRO");
  const canExportDespesas = isMaster || checkUserPermission('FINANCEIRO_EXPORTAR_DESPESAS');


  const [filters] = useStoreTablePagar((state) => [state.filters]);

  async function exportSolicitacao() {
    setIsPending(true);
    const response = await api.get(`/financeiro/contas-a-pagar/titulo/`, {
      params: { filters },
    });

    const rows = response?.data?.rows || [];
    const data = rows.map((row: TituloProps) => {
      return {
        ID: row.id,
        STATUS: row.status,
        "CRIADO EM": normalizeDate(row.created_at || ""),
        "NUM DOC": row.num_doc,
        DESCRIÇÃO: row.descricao,
        VALOR: parseFloat(row.valor),
        FILIAL: row.filial,
        FORNECEDOR: row.fornecedor,
        "CNPJ FORNECEDOR": row.cnpj_fornecedor,
        SOLICITANTE: row.solicitante,
        "FORMA DE PAGAMENTO": row.forma_pagamento,
      };
    });
    exportToExcel(data, `SOLICITAÇÕES`);
    setIsPending(false);
  }

  function exportLayoutPrevisaoPagamento() {
    exportPrevisaoPagamento({ filters });
  }
  function handleExportLayoutDespesas() {
    exportLayoutDespesas({ filters })
  }
  function handleExportLayoutDRE() {
    exportLayoutDRE({ filters })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        className="py-2 px-4 border border-emerald-200 dark:border-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm flex font-medium gap-2 items-center rounded-md"
        disabled={isPending}
      >
        {isPending ? <><Spinner /> Exportando...</>
          : <><Download className="me-2" size={18} /> Exportar</>}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={exportSolicitacao}>
          Layout Padrão
        </DropdownMenuItem>
        {isMaster && (
          <>
            <DropdownMenuItem onClick={exportLayoutPrevisaoPagamento}>
              Layout Previsão Pagamento
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportLayoutDRE}>
              Layout DRE
            </DropdownMenuItem>
          </>
        )}

        {canExportDespesas && (
          <DropdownMenuItem onClick={handleExportLayoutDespesas}>
            Layout Despesas
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={() => openModalExportDatasys("")}>
          Layout Datasys
        </DropdownMenuItem>
        <DropdownMenuItem>
          <a
            target="_blank"
            href="https://docs.google.com/spreadsheets/d/1xQXNc7i27msUu3W72tBmdniDZMa_82Hr/export?format=xlsx"
          >
            Planilha Padrão Importação
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ButtonExportTitulos;
