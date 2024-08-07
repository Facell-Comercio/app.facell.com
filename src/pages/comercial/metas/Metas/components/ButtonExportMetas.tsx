import { Button } from "@/components/ui/button";
// import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import fetchApi from "@/api/fetchApi";
import { exportToExcel } from "@/helpers/importExportXLS";
import { MetasProps } from "@/hooks/comercial/useMetas";
import { Download } from "lucide-react";
import { useState } from "react";
import { useStoreMetasAgregadores } from "../../store-metas-agregadores";
import { useStoreTableMetas } from "../table/store-table";

const ButtonExportMeta = () => {
  const [isPending, setIsPending] = useState(false);
  const [filters] = useStoreTableMetas((state) => [state.filters]);
  const [mes, ano] = useStoreMetasAgregadores((state) => [
    state.mes,
    state.ano,
  ]);

  async function handleClickExportMeta() {
    const { rows } = await fetchApi.comercial.metas.getAll({
      filters: {
        ...filters,
        mes,
        ano,
      },
    });
    const data = rows.map((row: MetasProps) => {
      return {
        ID: row.id,
        // "DATA INÍCIO COBRANÇA": normalizeDate(row.data_inicio_cobranca || ""),
        FILIAL: row.filial,
        // "NOME COLABORADOR": row.nome_colaborador,
        // ORIGEM: row.origem,
        // VALOR: parseFloat(row.valor),
        // SALDO: parseFloat(row.saldo),
      };
    });
    exportToExcel(data, `METAS`);
    setIsPending(false);
  }

  return (
    <span>
      <Button
        variant={"outline"}
        className="border-blue-200 dark:border-success"
        onClick={() => handleClickExportMeta()}
        disabled={isPending}
      >
        <Download className="me-2" size={18} /> Exportar
      </Button>
    </span>
  );
};

export default ButtonExportMeta;
