import { Button } from "@/components/ui/button";
// import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { CirclePlus } from "lucide-react";
import { useStoreEspelho } from "../espelho/store";

const ButtonItens = () => {
  const [openModalItens, qtde_itens, isPending] = useStoreEspelho((state) => [
    state.openModalItens,
    state.qtde_itens,
    state.isPending,
  ]);

  return (
    <Button
      variant={"outline"}
      className="border-destructive"
      disabled={isPending}
      onClick={() => openModalItens()}
    >
      <CirclePlus className="me-2" size={18} /> Inclusões ({qtde_itens || 0})
    </Button>
  );
};

export default ButtonItens;
