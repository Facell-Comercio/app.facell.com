import { api } from '@/lib/axios';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportToExcel } from '@/helpers/importExportXLS';
import { normalizeDate } from '@/helpers/mask';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { useStoreExportDatasys } from '../export-datasys/store';
import { useStoreTablePagar } from '../table/store-table';
import { TituloSchemaProps } from '../titulo/form-data';

export type ExportAnexosProps = {
  type: string;
  idSelection: number[];
};

interface TituloProps extends TituloSchemaProps {
  solicitante?: string;
  forma_pagamento?: string;
}

const ButtonExportTitulos = () => {
  const openModalExportDatasys = useStoreExportDatasys().openModal;
  const [isPending, setIsPending] = useState(false);
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
        'CRIADO EM': normalizeDate(row.created_at || ''),
        'NUM DOC': row.num_doc,
        DESCRIÇÃO: row.descricao,
        VALOR: parseFloat(row.valor),
        FILIAL: row.filial,
        'ID MATRIZ': row.id_matriz,
        FORNECEDOR: row.id_fornecedor,
        SOLICITANTE: row.solicitante,
        'FORMA DE PAGAMENTO': row.forma_pagamento,
      };
    });
    exportToExcel(data, `SOLICITAÇÕES`);
    setIsPending(false);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        className="py-2 px-4 border border-emerald-200 dark:border-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm flex font-medium gap-2 items-center rounded-md"
        disabled={isPending}
      >
        <Download className="me-2" size={18} /> Exportar
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={exportSolicitacao}>
          Layout Padrão
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openModalExportDatasys('')}>
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
