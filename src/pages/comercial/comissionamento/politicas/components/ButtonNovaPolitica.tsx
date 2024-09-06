import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
// import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";

const ButtonNovaPolitica = () => {
  return (
    <Button
      variant={"outline"}
      className="border-primary"
      // onClick={() =>

      // }
      // disabled={isPending}
    >
      <Plus className="me-2" size={18} /> Nova
      Política
    </Button>
  );
};

export default ButtonNovaPolitica;
