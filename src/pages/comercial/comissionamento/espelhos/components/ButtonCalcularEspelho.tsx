import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

export type ExportAnexosProps = {
  type: string;
  idSelection: number[];
};

const ButtonCalcularEspelho = () => {
  return (
    <Button
      variant={"outline"}
      className="border-violet-400 dark:border-violet-800 hover:bg-slate-100 dark:hover:bg-slate-800"

      // disabled={isPending}
    >
      <Calculator className="me-2" size={18} />{" "}
      Calcular
    </Button>
  );
};

export default ButtonCalcularEspelho;
