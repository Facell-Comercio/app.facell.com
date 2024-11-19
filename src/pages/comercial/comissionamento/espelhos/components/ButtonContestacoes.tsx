import { Button } from "@/components/ui/button";
// import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { TriangleAlert } from "lucide-react";

const ButtonContestacoes = () => {
  // const [filters] = useStoreTableEspelhos(
  //   (state) => [state.filters]
  // );

  return (
    <Button
      variant={"outline"}
      className="border-destructive"

      // disabled={isPending}
    >
      <TriangleAlert className="me-2" size={18} /> Contestações (1)
    </Button>
  );
};

export default ButtonContestacoes;
