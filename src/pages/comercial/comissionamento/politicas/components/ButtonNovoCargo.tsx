import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useStoreComissionamentoPoliticas } from "../store";
// import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";

const ButtonNovoCargo = () => {
  const openModal =
    useStoreComissionamentoPoliticas()
      .openModalCargo;
  return (
    <Button
      variant={"outline"}
      className="border-success"
      onClick={() => openModal()}
      // disabled={isPending}
    >
      <Plus className="me-2" size={18} /> Novo
      Cargo
    </Button>
  );
};

export default ButtonNovoCargo;
