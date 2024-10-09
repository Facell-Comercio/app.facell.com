import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useStoreTituloReceber } from "../titulo/store";

const ButtonNovoTitulo = () => {
  const openModal = useStoreTituloReceber().openModal;

  return (
    <span>
      <Button
        variant={"outline"}
        className="border-blue-200 dark:border-primary"
        onClick={() => openModal({ id: "" })}
      >
        <Plus className="me-2" size={18} /> Nova Solicitação
      </Button>
    </span>
  );
};

export default ButtonNovoTitulo;
