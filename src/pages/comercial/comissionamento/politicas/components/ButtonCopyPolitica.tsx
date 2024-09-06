import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

export type ExportAnexosProps = {
  type: string;
  idSelection: number[];
};

const ButtonCopyPolitica = () => {
  return (
    <Button
      variant={"outline"}
      className="border-violet-400 dark:border-violet-800 hover:bg-slate-100 dark:hover:bg-slate-800"

      // disabled={isPending}
    >
      <Copy className="me-2" size={18} /> Copiar
      Política
    </Button>
  );
};

export default ButtonCopyPolitica;
