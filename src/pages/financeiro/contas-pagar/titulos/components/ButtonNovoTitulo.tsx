import { Button } from "@/components/ui/button";
import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { Plus } from "lucide-react";
import { useStoreTitulo } from "../titulo/store";

const ButtonNovoTitulo = () => {
  const openModal = useStoreTitulo().openModal;
  const { data } = useTituloPagar().getPendencias();
  const qtdPendencias = data?.data;

  return (
    <span
      title={
        qtdPendencias > 0
          ? `Você possui ${qtdPendencias} notas fiscais pendentes de envio`
          : ""
      }
    >
      <Button
        variant={"outline"}
        className="border-blue-200 dark:border-primary"
        onClick={() => openModal("")}
        disabled={qtdPendencias > 0}
      >
        <Plus className="me-2" size={18} /> Nova Solicitação
      </Button>
    </span>
  );
};

export default ButtonNovoTitulo;
