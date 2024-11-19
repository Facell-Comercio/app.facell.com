import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollText } from "lucide-react";
import { useStorePoliticas } from "../politicas/store-politicas";
// import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";

const ButtonSelectPolitica = ({
  refDate,
  isLoading,
  disabled,
}: {
  refDate: string;
  isLoading: boolean;
  disabled: boolean;
}) => {
  const openModalPoliticas =
    useStorePoliticas().openModal;
  return !isLoading ? (
    <Button
      variant={"outline"}
      className="border-warning flex gap-2"
      onClick={() => openModalPoliticas()}
      disabled={disabled}
    >
      <ScrollText size={18} />
      {refDate}
    </Button>
  ) : (
    <span className="flex justify-end">
      <Skeleton className="w-44 h-10" />
    </span>
  );
};

export default ButtonSelectPolitica;
