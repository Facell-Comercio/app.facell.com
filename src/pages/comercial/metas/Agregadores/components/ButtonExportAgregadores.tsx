import { Button } from "@/components/ui/button";
// import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { useAgregadores } from "@/hooks/comercial/useAgregadores";
import { Download } from "lucide-react";
import { useStoreMetasAgregadores } from "../../store-metas-agregadores";
import { useStoreTableAgregadores } from "../table/store-table";

const ButtonExportAgregadores = () => {
  const [filters] = useStoreTableAgregadores((state) => [state.filters]);
  const [mes, ano] = useStoreMetasAgregadores((state) => [state.mes, state.ano]);

  const { mutate: exportAgregadores, isPending } = useAgregadores().exportAgregadores();

  return (
    <span>
      <Button
        variant={"outline"}
        className="border-success"
        onClick={() =>
          exportAgregadores({
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

export default ButtonExportAgregadores;
