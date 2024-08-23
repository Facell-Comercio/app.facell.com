import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Upload } from "lucide-react";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { exportToExcel, importFromExcel } from "@/helpers/importExportXLS";
import {
  AgregadoresProps,
  useAgregadores,
} from "@/hooks/comercial/useAgregadores";
import { formatDate } from "date-fns";
import { useEffect, useRef } from "react";
import { FaSpinner } from "react-icons/fa6";

export type ExportAnexosProps = {
  type: string;
  idSelection: number[];
};

const ButtonImportAgregador = () => {
  const {
    mutate: importAgregadores,
    isPending,
    isSuccess,
    data: resultadoImportAgregadores,
  } = useAgregadores().importAgregadores();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChangeImportButton = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async (e) => {
        const importedData = e.target?.result;
        const result = importFromExcel(importedData) as AgregadoresProps[];

        const responseError: any[] = [];
        if (responseError.length > 0) {
          toast({ title: "Erro na importação", variant: "destructive" });
          return;
        }
        importAgregadores(result);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
    }
  };

  useEffect(() => {
    if (isSuccess && resultadoImportAgregadores) {
      toast({
        title: "Sucesso",
        description: "Importação de agregadores realizada",
        action: (
          <ToastAction
            altText="Ver Resultados"
            onClick={() =>
              exportToExcel(
                resultadoImportAgregadores,
                `RESULTADO IMPORTAÇÃO AGREGADORES ${formatDate(
                  new Date(),
                  "dd-MM-yyyy hh.mm"
                )}`
              )
            }
          >
            Ver Resultados
          </ToastAction>
        ),
        duration: 3500,
        variant: "success",
      });
    }
  }, [isSuccess]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        className="py-2 px-4 border border-violet-400 dark:border-violet-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm flex font-medium gap-2 items-center rounded-md max-h-[40px]"
      >
        <Upload className="me-2" size={18} /> Importar
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="flex gap-2">
          <a
            target="_blank"
            href="https://docs.google.com/spreadsheets/d/1nwUdoZi-EUI3Kbe8LtZOMm3iFWSj4e-B/export?format=xlsx"
          >
            Baixar Planilha Padrão
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-2 p-0"
          onClick={(e) => e.preventDefault()}
        >
          <AlertPopUp
            className="w-full hover:bg-accent hover:text-accent-foreground"
            title="Deseja realmente importar?"
            description="Esta ação não pode ser desfeita. Todos os agregadores importados serão adicionados"
            action={() => fileInputRef.current && fileInputRef.current.click()}
          >
            <div className="flex gap-1 px-2 py-1.5 rounded-sm">
              {!isPending ? (
                <>Importar Planilha</>
              ) : (
                <>
                  <FaSpinner size={18} className="me-2 animate-spin" />{" "}
                  Importando...
                </>
              )}
            </div>
          </AlertPopUp>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleChangeImportButton}
        accept=".xlsx, .xls, .csv"
      />
    </DropdownMenu>
  );
};

export default ButtonImportAgregador;
