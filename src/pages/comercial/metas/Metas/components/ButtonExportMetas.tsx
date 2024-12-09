import { Button } from "@/components/ui/button";
// import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { useMetas } from "@/hooks/comercial/useMetas";
import { Download } from "lucide-react";
import { useStoreMetasAgregadores } from "../../store-metas-agregadores";
import { useStoreTableMetas } from "../table/store-table";

const ButtonExportMeta = () => {
  const [filters] = useStoreTableMetas((state) => [state.filters]);
  const [mes, ano] = useStoreMetasAgregadores((state) => [state.mes, state.ano]);
  const { mutate: exportMetas, isPending } = useMetas().exportMetas();

  return (
    <span>
      <Button
        variant={"outline"}
        className="border-success"
        onClick={() =>
          exportMetas({
            filters: {
              ...filters,
              mes,
              ano,
            },
          })
        }
        disabled={isPending}
      >
        <Download className="me-2" size={18} /> Exportar
      </Button>
    </span>
  );
};

export default ButtonExportMeta;
