import { Spinner } from "@/components/custom/Spinner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMailing } from "@/hooks/marketing/useMailing";
import { Download } from "lucide-react";
import { useStoreCampanha } from "../store";

export type ExportSubcampanhaProps = {
  type: string;
  id_subcampanha: string;
};

const ButtonExportarEvolux = ({ disabled }: { disabled: boolean }) => {
  const filters = useStoreCampanha().filters_lote;
  const { mutate: exportSubcampanha, isPending } = useMailing().exportSubcampanha();

  function handleExportSubcampanha(type: "xlsx" | "csv") {
    exportSubcampanha({ id_campanha: filters.id_campanha || "", filters, type });
  }

  return (
    <DropdownMenu modal>
      <DropdownMenuTrigger
        type="button"
        className="w-full"
        // className="py-2 px-4 bg-success w-full text-white text-sm  text-nowrap flex font-medium gap-2 items-center rounded-md disabled:opacity-50"
        disabled={isPending || disabled}
        asChild
      >
        <div className="min-w-full">
          <Button variant={"success"} className="w-full" disabled={isPending || disabled}>
            {isPending ? (
              <>
                <Spinner /> Exportando...
              </>
            ) : (
              <>
                <Download className="me-2" size={18} /> Exportação Evolux
              </>
            )}
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExportSubcampanha("csv")}>
          Exportação Evolux (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExportSubcampanha("xlsx")}>
          Exportação Evolux (EXCEL)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ButtonExportarEvolux;
