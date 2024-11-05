import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { useStoreComissionamentoPoliticas } from "../store";
// import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";

const ButtonNovoCargo = ({
  isLoading,
  disabled,
}: {
  isLoading: boolean;
  disabled: boolean;
}) => {
  const openModal =
    useStoreComissionamentoPoliticas()
      .openModalCargo;
  return !isLoading ? (
    <Button
      variant={"outline"}
      className="border-success"
      onClick={() => openModal()}
      disabled={disabled}
    >
      <Plus className="me-2" size={18} /> Novo
      Cargo
    </Button>
  ) : (
    <span className="flex justify-end">
      <Skeleton className="w-44 h-10" />
    </span>
  );
};

export default ButtonNovoCargo;
