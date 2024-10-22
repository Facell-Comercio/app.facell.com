import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Download } from "lucide-react";
import { useState } from "react";
import { useStoreTableReceber } from "../table/store-table";
// import { TituloSchemaProps } from "../titulo/form-data";
import fetchApi from "@/api/fetchApi";
import { Spinner } from "@/components/custom/Spinner";
import { exportToExcel } from "@/helpers/importExportXLS";
import { normalizeDate } from "@/helpers/mask";
import { formatDate } from "date-fns";
import { TituloCRSchemaProps } from "../titulo/form-data";

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

const ButtonExportTitulosReceber = () => {
  const [isPending, setIsPending] = useState(false);
  const [filters] = useStoreTableReceber((state) => [state.filters]);

  async function handleExportTitulosReceber() {
    setIsPending(true);
    const response = await fetchApi.financeiro.contas_receber.titulos.getAll({ filters });

    const rows = response?.rows || [];
    const data = rows.map((row: TituloCRSchemaProps) => {
      return {
        ID: row.id,
        STATUS: row.status,
        "CRIADO EM": normalizeDate(row.created_at || ""),
        "NUM DOC": row.num_doc,
        DESCRIÇÃO: row.descricao,
        VALOR: parseFloat(row.valor),
        FILIAL: row.filial,
        FORNECEDOR: row.nome_fornecedor,
        "CNPJ FORNECEDOR": row.cnpj_fornecedor,
        CRIADOR: row.criador,
      };
    });
    exportToExcel(data, `SOLICITAÇÕES A RECEBER - ${formatDate(new Date(), "dd/MM/yyyy HH:mm")}`);
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
        <DropdownMenuItem onClick={handleExportTitulosReceber}>Layout Padrão</DropdownMenuItem>

        <DropdownMenuItem>
          <a target="_blank" href="#">
            Planilha Padrão Importação
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ButtonExportTitulosReceber;
