import AlertPopUp from "@/components/custom/AlertPopUp";
import { Button } from "@/components/ui/button";
import { useVendasInvalidadas } from "@/hooks/comercial/useVendasInvalidadas";
import { Trash } from "lucide-react";
import { useStoreTableVendasInvalidadas } from "../table/store-table";

const ButtonExcluir = () => {
  const [mes, ano] = useStoreTableVendasInvalidadas((state) => [state.mes, state.ano]);
  const { mutate: excluirVendasInvalidadas, isPending } =
    useVendasInvalidadas().excluirVendasInvalidadas();
  return (
    <AlertPopUp
      title={"Deseja realmente excluir"}
      description="Essa ação não pode ser desfeita. Todas as vendas inválidadas desse mês serão definitivamente removidas do servidor."
      action={() => {
        excluirVendasInvalidadas({ mes, ano });
      }}
    >
      <Button variant={"outline"} className="border-destructive" disabled={isPending}>
        <Trash className="me-2" size={18} /> Excluir
      </Button>
    </AlertPopUp>
  );
};

export default ButtonExcluir;
