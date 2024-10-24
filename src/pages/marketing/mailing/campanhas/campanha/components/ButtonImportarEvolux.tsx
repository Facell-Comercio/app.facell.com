import { Spinner } from "@/components/custom/Spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMailing } from "@/hooks/marketing/useMailing";
import { Upload } from "lucide-react";
import { useRef } from "react";
import { useStoreCampanha } from "../store";

export type ExportSubcampanhaProps = {
  type: string;
  id_subcampanha: string;
};

const ButtonImportarSubcampanhas = () => {
  const filters = useStoreCampanha().filters_lote;
  const { mutate: exportSubcampanha, isPending } = useMailing().exportSubcampanha();

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExportSubcampanha(type: "xlsx" | "csv") {
    exportSubcampanha({ id_subcampanha: filters.id_campanha || "", type });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        className="py-2 px-4 bg-secondary text-sm flex font-medium gap-2 items-center rounded-md "
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Spinner /> Exportando...
          </>
        ) : (
          <>
            <Upload className="me-2" size={18} /> Importação Evolux
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExportSubcampanha("csv")}>
          Exportação Evolux (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExportSubcampanha("xlsx")}>
          Exportação Evolux (EXCEL)
        </DropdownMenuItem>
      </DropdownMenuContent>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        // onChange={handleChangeImportButton}
        accept=".xlsx, .xls, .csv"
      />
    </DropdownMenu>
  );
};

export default ButtonImportarSubcampanhas;
