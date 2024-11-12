import AlertPopUp from "@/components/custom/AlertPopUp";
import { Button } from "@/components/ui/button";
import { useVendasInvalidadas } from "@/hooks/comercial/useVendasInvalidadas";
import { RotateCw } from "lucide-react";
import { useStoreTableVendasInvalidadas } from "../table/store-table";

export type ExportAnexosProps = {
  type: string;
  idSelection: number[];
};

const ButtonProcessar = () => {
  const [mes, ano] = useStoreTableVendasInvalidadas((state) => [state.mes, state.ano]);
  const { mutate: processarVendasInvalidadas, isPending } =
    useVendasInvalidadas().processarVendasInvalidadas();
  return (
    <AlertPopUp
      title={"Deseja realmente processar"}
      description="Essa ação não pode ser desfeita. As vendas inválidadas deste mês serão reprocessadas."
      action={() => {
        processarVendasInvalidadas({ mes, ano });
      }}
    >
      <Button
        variant={"outline"}
        className="border-warning hover:bg-slate-100 dark:hover:bg-slate-800"
        disabled={isPending}
      >
        <RotateCw className={`me-2 ${isPending && "animate-spin"}`} size={18} /> Processar
      </Button>
    </AlertPopUp>
  );
};

export default ButtonProcessar;
