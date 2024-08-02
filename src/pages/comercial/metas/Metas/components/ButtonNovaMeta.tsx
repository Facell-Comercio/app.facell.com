import { Button } from "@/components/ui/button";
// import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { Plus } from "lucide-react";
import { useStoreMeta } from "../vale/store";

const ButtonNovaMeta = () => {
  const openModal = useStoreMeta().openModal;
  const editModal = useStoreMeta().editModal;

  function handleClickNewMeta() {
    openModal("");
    editModal(true);
  }

  return (
    <span>
      <Button
        variant={"outline"}
        className="border-blue-200 dark:border-primary"
        onClick={() => handleClickNewMeta()}
        // disabled={qtdPendencias > 0}
      >
        <Plus className="me-2" size={18} /> Nova Meta
      </Button>
    </span>
  );
};

export default ButtonNovaMeta;
