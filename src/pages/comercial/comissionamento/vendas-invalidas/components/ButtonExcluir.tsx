import { Button } from "@/components/ui/button";
// import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { Trash } from "lucide-react";

const ButtonExcluir = () => {
  return (
    <Button
      variant={"outline"}
      className="border-destructive"

      // disabled={isPending}
    >
      <Trash className="me-2" size={18} /> Excluir
    </Button>
  );
};

export default ButtonExcluir;
