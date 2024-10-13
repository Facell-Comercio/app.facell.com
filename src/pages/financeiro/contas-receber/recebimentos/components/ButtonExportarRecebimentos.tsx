import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Download } from "lucide-react";
import { useState } from "react";
import { useStoreTableRecebimentos } from "../table/store-table";
// import { TituloSchemaProps } from "../titulo/form-data";
import fetchApi from "@/api/fetchApi";
import { Spinner } from "@/components/custom/Spinner";
import { exportToExcel } from "@/helpers/importExportXLS";
import { normalizeDate } from "@/helpers/mask";
import { RecebimentoProps } from "@/hooks/financeiro/useTituloReceber";
import { formatDate } from "date-fns";

export type ExportAnexosProps = {
  type: string;
  idSelection: number[];
};

// interface TituloProps extends TituloSchemaProps {
//   solicitante?: string;
//   forma_pagamento?: string;
//   fornecedor?: string;
//   cnpj_fornecedor?: string;
// }

const ButtonExportRecebimentos = () => {
  const [isPending, setIsPending] = useState(false);
  const [filters] = useStoreTableRecebimentos((state) => [state.filters]);

  async function handleExportRecebimentos() {
    setIsPending(true);
    const response = await fetchApi.financeiro.contas_receber.titulos.getAllRecebimentos({
      filters,
    });

    const rows = response?.rows || [];
    const data = rows.map((row: RecebimentoProps) => {
      return {
        "ID TÍTULO": row.id_titulo,
        "DATA PAGAMENTO": normalizeDate(row.data || ""),
        VALOR: parseFloat(row.valor || "0"),
        "NUM DOC": row.num_doc,
        "CONTA BANCÁRIA": row.conta_bancaria,
        FORNECEDOR: row.fornecedor,
        FILIAL: row.filial,
        DESCRIÇÃO: row.descricao,
        CRIADOR: row.criador,
      };
    });
    exportToExcel(data, `RECEBIMENTOS - ${formatDate(new Date(), "dd/MM/yyyy HH:mm")}`);
    setIsPending(false);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        className="py-2 px-4 border border-emerald-200 dark:border-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm flex font-medium gap-2 items-center rounded-md"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Spinner /> Exportando...
          </>
        ) : (
          <>
            <Download className="me-2" size={18} /> Exportar
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleExportRecebimentos}>Layout Padrão</DropdownMenuItem>

        <DropdownMenuItem>
          <a target="_blank" href="#">
            Planilha Padrão Importação
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ButtonExportRecebimentos;
