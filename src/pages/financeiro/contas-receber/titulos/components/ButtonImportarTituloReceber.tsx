import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToExcel } from "@/helpers/importExportXLS";
import { Upload } from "lucide-react";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { importFromExcel } from "@/helpers/importExportXLS";
import { parseCurrency } from "@/helpers/mask";
import { useTituloReceber } from "@/hooks/financeiro/useTituloReceber";
import { formatDate } from "date-fns";
import { useEffect, useRef } from "react";
import { FaSpinner } from "react-icons/fa6";

export type LancamentoReebolsoTimProps = {
  pedido?: string;
  pedido_sap?: string;
  cnpj?: string;
  mes?: string;
  ano?: string;
  tipo_de_remuneracao?: string;
  valor_total?: number;
};

export type ExportAnexosProps = {
  type: string;
  idSelection: number[];
};

const ButtonImportTitulosReceber = () => {
  const {
    mutate: lancamentoReebolsoTim,
    isPending,
    isSuccess,
    data: resultadoLancamentoReebolsoTim,
  } = useTituloReceber().lancamentoReebolsoTim();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChangeImportButton = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async (e) => {
        const importedData = e.target?.result;
        const result = importFromExcel(importedData)
          .filter((value: any) => parseCurrency(value["Valor Total"]) > 0)
          .map((value: any) => ({
            pedido: value["Pedido"],
            cnpj: value["Pedido"],
            pedido_sap: value["Pedido SAP"],
            mes: value["Mês"],
            ano: value["Ano"],
            tipo_de_remuneracao: value["Tipo de Remuneração"],
            valor_total: parseCurrency(value["Valor Total"]),
          })) as LancamentoReebolsoTimProps[];

        const responseError: any[] = [];
        if (responseError.length > 0) {
          toast({ title: "Erro na importação", variant: "destructive" });
          return;
        }

        lancamentoReebolsoTim(result);
      };
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (isSuccess && resultadoLancamentoReebolsoTim) {
      toast({
        title: "Sucesso",
        description: "Lançamento de solicitações a receber realizado",
        action: (
          <ToastAction
            altText="Ver Resultados"
            onClick={() =>
              exportToExcel(
                resultadoLancamentoReebolsoTim,
                `RESULTADO LANÇAMENTO SOLICITAÇÕES A RECEBER ${formatDate(
                  new Date(),
                  "dd-MM-yyyy"
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
        className="py-2 px-4 border border-violet-400 dark:border-violet-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm flex font-medium gap-2 items-center rounded-md"
      >
        <Upload className="me-2" size={18} /> Importar
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="flex gap-2" onClick={(e) => e.preventDefault()}>
          <AlertPopUp
            className="w-full hover:bg-accent hover:text-accent-foreground"
            title="Deseja realmente importar?"
            description="Esta ação não pode ser desfeita. Todos as solicitações a receber importadas serão adicionadas"
            action={() => fileInputRef.current && fileInputRef.current.click()}
          >
            <div>
              {!isPending ? (
                <>Reembolsos TIM - Sintético</>
              ) : (
                <>
                  <FaSpinner size={18} className="me-2 animate-spin" /> Importando...
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

export default ButtonImportTitulosReceber;
