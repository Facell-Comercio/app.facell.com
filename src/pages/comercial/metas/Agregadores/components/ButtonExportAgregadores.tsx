import { Button } from "@/components/ui/button";
// import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import fetchApi from "@/api/fetchApi";
import { exportToExcel } from "@/helpers/importExportXLS";
import { AgregadoresProps } from "@/hooks/comercial/useAgregadores";
import { Download } from "lucide-react";
import { useState } from "react";
import { useStoreMetasAgregadores } from "../../store-metas-agregadores";
import { useStoreTableAgregadores } from "../table/store-table";

const ButtonExportAgregadores = () => {
  const [isPending, setIsPending] = useState(false);
  const [filters] = useStoreTableAgregadores((state) => [state.filters]);
  const [mes, ano] = useStoreMetasAgregadores((state) => [
    state.mes,
    state.ano,
  ]);

  async function handleClickExportAgregadores() {
    const { rows } = await fetchApi.comercial.agregadores.getAll({
      filters: {
        ...filters,
        mes,
        ano,
      },
    });
    const data = rows.map((row: AgregadoresProps) => {
      return {
        ID: row.id,
        REF: new Date(row.ref || "").toLocaleDateString("pt-BR"),
        CICLO: new Date(row.ciclo || "").toLocaleDateString("pt-BR"),
        "GRUPO ECONÔMICO": row.grupo_economico,
        FILIAL: row.filial,
        CARGO: row.cargo,
        CPF: row.cpf,
        NOME: row.nome,
        TAGS: row.tags || null,
        "DATA INICIAL": new Date(row.data_inicial || "").toLocaleDateString(
          "pt-BR"
        ),
        "DATA FINAL": new Date(row.data_final || "").toLocaleDateString(
          "pt-BR"
        ),
        PROPORCIONAL:
          (parseFloat(row.proporcional || "0") * 100)
            ?.toFixed(2)
            .replace(".", ",") + "%",
        "TIPO AGREGAÇÃO": row.tipo_agregacao,
      };
    });

    exportToExcel(data, `AGREGADORES`);
    setIsPending(false);
  }

  return (
    <span>
      <Button
        variant={"outline"}
        className="border-blue-200 dark:border-success"
        onClick={() => handleClickExportAgregadores()}
        disabled={isPending}
      >
        <Download className="me-2" size={18} /> Exportar
      </Button>
    </span>
  );
};

export default ButtonExportAgregadores;
