import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { useStorePolitica } from "../politica/store";
// import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";

const ButtonNovaPolitica = ({
  isLoading,
  disabled,
}: {
  isLoading: boolean;
  disabled: boolean;
}) => {
  const openModal = useStorePolitica().openModal;
  return !isLoading ? (
    <Button
      variant={"outline"}
      className="border-primary"
      onClick={() =>
        openModal({ action: "insert" })
      }
      disabled={disabled}
    >
      <Plus className="me-2" size={18} /> Nova
      Política
    </Button>
  ) : (
    <span className="flex justify-end">
      <Skeleton className="w-44 h-10" />
    </span>
  );
};

export default ButtonNovaPolitica;
