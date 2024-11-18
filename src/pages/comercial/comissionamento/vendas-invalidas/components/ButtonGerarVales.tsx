import AlertPopUp from "@/components/custom/AlertPopUp";
import { Button } from "@/components/ui/button";
import { useVendasInvalidadas } from "@/hooks/comercial/useVendasInvalidadas";
import { HandCoins } from "lucide-react";
import { useEffect } from "react";
import { FaSpinner } from "react-icons/fa6";
import { useStoreTableVendasInvalidadas } from "../table/store-table";
import { useStoreVendaInvalidada } from "../venda-invalida/store";

const ButtonGerarVales = () => {
  const [mes, ano] = useStoreTableVendasInvalidadas((state) => [state.mes, state.ano]);

  const [isPending, editIsPending] = useStoreVendaInvalidada((state) => [
    state.isPending,
    state.editIsPending,
  ]);

  const {
    mutate: gerarVales,
    isPending: gerarValesIsPending,
    isSuccess: gerarValesIsSuccess,
    isError: gerarValesIsError,
  } = useVendasInvalidadas().gerarVales();

  useEffect(() => {
    if (gerarValesIsSuccess) {
      editIsPending(false);
    } else if (gerarValesIsError) {
      editIsPending(false);
    } else if (gerarValesIsPending) {
      editIsPending(true);
    }
  }, [gerarValesIsPending]);

  return (
    <AlertPopUp
      title={"Deseja realmente gerar os vales?"}
      description="Essa ação não pode ser desfeita. Os vales serão gerados automáticamente de acordo com os rateios de algumas vendas."
      action={() => {
        gerarVales({ ref: `${ano}-${mes}-01` });
      }}
    >
      <Button variant={"outline"} className="border-destructive" disabled={isPending}>
        {gerarValesIsPending ? (
          <FaSpinner size={18} className="me-2 animate-spin" />
        ) : (
          <HandCoins className="me-2" size={18} />
        )}
        Gerar Vales
      </Button>
    </AlertPopUp>
  );
};

export default ButtonGerarVales;
