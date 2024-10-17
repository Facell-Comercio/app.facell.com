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
import { useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa6";

export type LancamentoTimProps = {
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
    mutate: lancamentoReembolsoTim,
    isPending: isPendingReembolsoTim,
    isSuccess: isSuccessReembolsoTim,
    data: resultadoLancamentoReembolsoTim,
  } = useTituloReceber().lancamentoReembolsoTim();
  const {
    mutate: lancamentoComissoesTim,
    isPending: isPendingComissoesTim,
    isSuccess: isSuccessComissoesTim,
    data: resultadoLancamentoComissoesTim,
  } = useTituloReceber().lancamentoComissoesTim();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [option, setOption] = useState<string | undefined>();

  const handleChangeImportButton = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async (e) => {
        const importedData = importFromExcel(e.target?.result);
        if (option === "reembolsos_tim_sintetico") {
          reembolsoTim(importedData);
        }
        if (option === "comissoes_tim_sintetico") {
          comissoesTim(importedData);
        }
      };
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  //* FUNÇÃO DE IMPORTAÇÃO EM LOTE DOS REEMBOLSOS TIM
  function reembolsoTim(importedData: any[]) {
    const result = importedData
      .filter((value: any) => parseCurrency(value["Valor Total"]) > 0)
      .map((value: any) => ({
        pedido: value["Pedido"],
        cnpj: value["CNPJ"],
        pedido_sap: value["Pedido SAP"],
        mes: value["Mês"].trim(),
        ano: value["Ano"],
        tipo_de_remuneracao: value["Tipo de Remuneração"].trim(),
        valor_total: parseCurrency(value["Valor Total"]),
      })) as LancamentoTimProps[];
    lancamentoReembolsoTim({ items_list: result });
  }

  //* FUNÇÃO DE IMPORTAÇÃO EM LOTE DAS COMISSÕES TIM
  function comissoesTim(importedData: any[]) {
    const result = importedData
      .filter((value: any) => parseCurrency(value["Valor Total"]) > 0)
      .map((value: any) => ({
        pedido: value["Pedido"],
        cnpj: value["CNPJ"],
        pedido_sap: value["Pedido SAP"],
        mes: value["Mês"].trim(),
        ano: value["Ano"],
        tipo_de_remuneracao: value["Tipo de Remuneração"].trim(),
        valor_total: parseCurrency(value["Valor Total"]),
      })) as LancamentoTimProps[];
    lancamentoComissoesTim({ items_list: result });
  }

  //* Mensagem Reembolso TIM
  useEffect(() => {
    if (isSuccessReembolsoTim && resultadoLancamentoReembolsoTim) {
      toast({
        title: "Sucesso",
        description: "Lançamento de solicitações a receber realizado",
        action: (
          <ToastAction
            altText="Ver Resultados"
            onClick={() =>
              exportToExcel(
                resultadoLancamentoReembolsoTim,
                `RESULTADO LANÇAMENTO SOLICITAÇÕES REEMBOLSO TIM ${formatDate(
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
  }, [isSuccessReembolsoTim]);

  //* Mensagem Comissões TIM
  useEffect(() => {
    if (isSuccessComissoesTim && resultadoLancamentoComissoesTim) {
      toast({
        title: "Sucesso",
        description: "Lançamento de solicitações a receber realizado",
        action: (
          <ToastAction
            altText="Ver Resultados"
            onClick={() =>
              exportToExcel(
                resultadoLancamentoComissoesTim,
                `RESULTADO LANÇAMENTO SOLICITAÇÕES COMISSÕES TIM ${formatDate(
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
  }, [isSuccessComissoesTim]);

  const btnDisabled = isPendingReembolsoTim || isPendingComissoesTim;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        className="py-2 px-4 border border-violet-400 dark:border-violet-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm flex font-medium gap-2 items-center rounded-md"
      >
        <Upload className="me-2" size={18} /> Importar
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="flex gap-2"
          onClick={(e) => e.preventDefault()}
          disabled={btnDisabled}
        >
          <AlertPopUp
            className="w-full hover:bg-accent hover:text-accent-foreground"
            title="Deseja realmente importar?"
            description="Esta ação não pode ser desfeita. Todos as solicitações a receber importadas serão adicionadas"
            action={() => {
              setOption("reembolsos_tim_sintetico");
              fileInputRef.current && fileInputRef.current.click();
            }}
          >
            <div>
              {!isPendingReembolsoTim ? (
                <>Reembolsos TIM - Sintético</>
              ) : (
                <div className="flex gap-2">
                  <FaSpinner size={18} className="me-2 animate-spin" /> Importando...
                </div>
              )}
            </div>
          </AlertPopUp>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-2"
          onClick={(e) => e.preventDefault()}
          disabled={btnDisabled}
        >
          <AlertPopUp
            className="w-full hover:bg-accent hover:text-accent-foreground"
            title="Deseja realmente importar?"
            description="Esta ação não pode ser desfeita. Todos as solicitações a receber importadas serão adicionadas"
            action={() => {
              setOption("comissoes_tim_sintetico");
              fileInputRef.current && fileInputRef.current.click();
            }}
          >
            <div>
              {!isPendingComissoesTim ? (
                <>Comissões TIM - Sintético</>
              ) : (
                <div className="flex gap-2">
                  <FaSpinner size={18} className="me-2 animate-spin" /> Importando...
                </div>
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
