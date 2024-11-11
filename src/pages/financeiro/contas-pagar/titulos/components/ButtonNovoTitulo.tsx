import { Button } from "@/components/ui/button";
// import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { Plus } from "lucide-react";
import { useStoreTituloPagar } from "../titulo/store";

const ButtonNovoTitulo = () => {
  const openModal = useStoreTituloPagar().openModal;
  // const { data } = useTituloPagar().getPendencias();
  // const qtdPendencias = data?.data;

  return (
    <span>
      <Button
        variant={"outline"}
        className="border-blue-200 dark:border-primary"
        onClick={() => openModal({id: ''})}
        // disabled={qtdPendencias > 0}
      >
        <Plus className="me-2" size={18} /> Nova Solicitação
      </Button>
    </span>
  );
};

export default ButtonNovoTitulo;
