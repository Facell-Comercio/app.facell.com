import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useStoreRecebimentos } from "../store";

const ButtonNovoRecebimentoBancario = () => {
  const openModalRecebimentoBancario = useStoreRecebimentos().openModalRecebimentoBancario;

  return (
    <span>
      <Button
        variant={"outline"}
        className="border-blue-200 dark:border-violet-500"
        onClick={() => openModalRecebimentoBancario()}
      >
        <Plus className="me-2" size={18} /> Recebimento Bancário
      </Button>
    </span>
  );
};

export default ButtonNovoRecebimentoBancario;
