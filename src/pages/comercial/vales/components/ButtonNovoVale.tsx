import { Button } from "@/components/ui/button";
// import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { Plus } from "lucide-react";
import { useStoreVale } from "../vale/store";

const ButtonNovoVale = () => {
  const openModal = useStoreVale().openModal;
  const editModal = useStoreVale().editModal;

  function handleClickNewVale() {
    openModal("");
    editModal(true);
  }

  return (
    <span>
      <Button
        variant={"outline"}
        className="border-blue-200 dark:border-primary"
        onClick={() => handleClickNewVale()}
        // disabled={qtdPendencias > 0}
      >
        <Plus className="me-2" size={18} /> Nova Solicitação
      </Button>
    </span>
  );
};

export default ButtonNovoVale;
