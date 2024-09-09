import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy } from "lucide-react";
import { useStorePolitica } from "../politica/store";

export type ExportAnexosProps = {
  type: string;
  idSelection: number[];
};

const ButtonCopyPolitica = ({
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
      className="border-violet-400 dark:border-violet-800 hover:bg-slate-100 dark:hover:bg-slate-800"
      disabled={disabled}
      onClick={() =>
        openModal({ action: "copy" })
      }
    >
      <Copy className="me-2" size={18} /> Copiar
      Política
    </Button>
  ) : (
    <span className="flex justify-end">
      <Skeleton className="w-44 h-10" />
    </span>
  );
};

export default ButtonCopyPolitica;
