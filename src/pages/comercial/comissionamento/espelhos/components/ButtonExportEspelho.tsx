import { Button } from "@/components/ui/button";
// import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { useEspelhos } from "@/hooks/comercial/useEspelhos";
import { Download } from "lucide-react";
import { useStoreTableEspelhos } from "../table/store-table";

const ButtonExportEspelho = () => {
  const [filters] = useStoreTableEspelhos(
    (state) => [state.filters]
  );

  const { mutate: exportEspelhos, isPending } =
    useEspelhos().exportEspelhos();

  return (
    <Button
      variant={"outline"}
      className="border-blue-200 dark:border-success"
      onClick={() =>
        exportEspelhos({
          filters,
        })
      }
      disabled={isPending}
    >
      <Download className="me-2" size={18} />{" "}
      Exportar
    </Button>
  );
};

export default ButtonExportEspelho;
