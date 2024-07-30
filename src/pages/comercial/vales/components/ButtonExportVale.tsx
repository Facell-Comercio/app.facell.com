import { Button } from "@/components/ui/button";
// import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import fetchApi from "@/api/fetchApi";
import { exportToExcel } from "@/helpers/importExportXLS";
import { normalizeDate } from "@/helpers/mask";
import { ValeProps } from "@/hooks/comercial/useVales";
import { Download } from "lucide-react";
import { useState } from "react";
import { useStoreTableVale } from "../table/store-table";

const ButtonExportVale = () => {
  const [isPending, setIsPending] = useState(false);
  const [filters] = useStoreTableVale((state) => [state.filters]);

  async function handleClickExportVale() {
    const { rows } = await fetchApi.comercial.vales.getAll({
      filters,
    });
    const data = rows.map((row: ValeProps) => {
      return {
        ID: row.id,
        "DATA INÍCIO COBRANÇA": normalizeDate(row.data_inicio_cobranca || ""),
        FILIAL: row.filial,
        "NOME COLABORADOR": row.nome_colaborador,
        ORIGEM: row.origem,
        VALOR: parseFloat(row.valor),
        SALDO: parseFloat(row.saldo),
      };
    });
    exportToExcel(data, `VALES`);
    setIsPending(false);
  }

  return (
    <span>
      <Button
        variant={"outline"}
        className="border-blue-200 dark:border-success"
        onClick={() => handleClickExportVale()}
        disabled={isPending}
      >
        <Download className="me-2" size={18} /> Exportar
      </Button>
    </span>
  );
};

export default ButtonExportVale;
