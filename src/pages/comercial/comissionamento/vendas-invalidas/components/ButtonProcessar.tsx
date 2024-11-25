import AlertPopUp from "@/components/custom/AlertPopUp";
import { Button } from "@/components/ui/button";
import { useVendasInvalidadas } from "@/hooks/comercial/useVendasInvalidadas";
import { RotateCw } from "lucide-react";
import { useEffect } from "react";
import { useStoreTableVendasInvalidadas } from "../table/store-table";
import { useStoreVendaInvalidada } from "../venda-invalida/store";

export type ExportAnexosProps = {
  type: string;
  idSelection: number[];
};

const ButtonProcessar = () => {
  const [mes, ano] = useStoreTableVendasInvalidadas((state) => [state.mes, state.ano]);
  const [isPending, editIsPending] = useStoreVendaInvalidada((state) => [
    state.isPending,
    state.editIsPending,
  ]);
  const {
    mutate: processarVendasInvalidadas,
    isPending: processarVendasInvalidadasIsPending,
    isSuccess: processarVendasInvalidadasIsSuccess,
    isError: processarVendasInvalidadasIsError,
  } = useVendasInvalidadas().processarVendasInvalidadas();
  useEffect(() => {
    if (processarVendasInvalidadasIsSuccess) {
      editIsPending(false);
    } else if (processarVendasInvalidadasIsError) {
      editIsPending(false);
    } else if (processarVendasInvalidadasIsPending) {
      editIsPending(true);
    }
  }, [processarVendasInvalidadasIsPending]);

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
        <RotateCw
          className={`me-2 ${processarVendasInvalidadasIsPending && "animate-spin"}`}
          size={18}
        />{" "}
        Processar
      </Button>
    </AlertPopUp>
  );
};

export default ButtonProcessar;
