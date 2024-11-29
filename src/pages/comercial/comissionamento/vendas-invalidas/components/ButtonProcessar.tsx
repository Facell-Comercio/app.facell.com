import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

export type ExportAnexosProps = {
  type: string;
  idSelection: number[];
};

const ButtonProcessar = () => {
  return (
    <Button
      variant={"outline"}
      className="border-warning hover:bg-slate-100 dark:hover:bg-slate-800"

      // disabled={isPending}
    >
      <RotateCw className="me-2" size={18} />{" "}
      Processar
    </Button>
  );
};

export default ButtonProcessar;
