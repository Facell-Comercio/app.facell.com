import { Button } from "@/components/ui/button";
// import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { TriangleAlert } from "lucide-react";
import { useStoreEspelho } from "../espelho/store";

const ButtonContestacoes = () => {
  const [openModalContestacoes, qtde_contestacoes, isPending] = useStoreEspelho((state) => [
    state.openModalContestacoes,
    state.qtde_contestacoes,
    state.isPending,
  ]);

  return (
    <Button
      variant={"outline"}
      className="border-destructive"
      disabled={isPending}
      onClick={() => openModalContestacoes()}
    >
      <TriangleAlert className="me-2" size={18} /> Contestações ({qtde_contestacoes || 0})
    </Button>
  );
};

export default ButtonContestacoes;
