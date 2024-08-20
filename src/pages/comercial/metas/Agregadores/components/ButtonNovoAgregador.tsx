import { Button } from "@/components/ui/button";
// import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { Plus } from "lucide-react";
import { useStoreAgregador } from "../agregador/store-agregador";

const ButtonNovoAgregador = () => {
  const openModal = useStoreAgregador().openModal;
  const editModal = useStoreAgregador().editModal;

  function handleClickNewAgregador() {
    openModal("");
    editModal(true);
  }

  return (
    <span>
      <Button
        variant={"outline"}
        className="border-blue-200 dark:border-primary"
        onClick={() => handleClickNewAgregador()}
        // disabled={qtdPendencias > 0}
      >
        <Plus className="me-2" size={18} /> Novo Agregador
      </Button>
    </span>
  );
};

export default ButtonNovoAgregador;
