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
import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { useEffect, useRef } from "react";
import { FaSpinner } from "react-icons/fa6";

export type LancamentoLoteProps = {
  id_tipo_solicitacao?: string;
  id_forma_pagamento?: string;

  CNPJ_FORNECEDOR?: string;
  CNPJ_FILIAL?: string;
  CNPJ_FILIAL_RATEIO?: string;

  DATA_EMISSAO?: string;
  DATA_VENCIMENTO?: string;

  DOCUMENTO?: string;
  DESCRICAO?: string;
  VALOR?: string;

  CENTRO_CUSTO?: string;
  PLANO_CONTAS?: string;
  CODIGO_BARRAS?: string;
  PIX_COPIA_COLA?: string;
};

export type ExportAnexosProps = {
  type: string;
  idSelection: number[];
};

const ButtonImportTitulosReceber = () => {
  const {
    mutate: lancamentoLote,
    isPending,
    isSuccess,
    data: resultadoLancamentoLote,
  } = useTituloPagar().lancamentoLote();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChangeImportButton = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async (e) => {
        const importedData = e.target?.result;
        const result = importFromExcel(importedData).filter(
          (value: any) =>
            value.id_tipo_solicitacao !== "" &&
            value.CNPJ_FORNECEDOR !== "" &&
            value.CNPJ_FILIAL !== "" &&
            value.CNPJ_FILIAL_RATEIO !== ""
        ) as LancamentoLoteProps[];
        // console.log(result);

        const responseError: any[] = [];
        if (responseError.length > 0) {
          toast({ title: "Erro na importação", variant: "destructive" });
          return;
        }
        lancamentoLote(result);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
    }
  };

  useEffect(() => {
    if (isSuccess && resultadoLancamentoLote) {
      toast({
        title: "Sucesso",
        description: "Lançamento de solicitações realizado",
        action: (
          <ToastAction
            altText="Ver Resultados"
            onClick={() =>
              exportToExcel(resultadoLancamentoLote, `RESULTADO LANÇAMENTO SOLICITAÇÕES`)
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
        <DropdownMenuItem className="flex gap-2">
          <a
            target="_blank"
            href="https://docs.google.com/spreadsheets/d/1xQXNc7i27msUu3W72tBmdniDZMa_82Hr/export?format=xlsx"
          >
            Baixar Planilha Padrão
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex gap-2" onClick={(e) => e.preventDefault()}>
          <AlertPopUp
            className="w-full hover:bg-accent hover:text-accent-foreground"
            title="Deseja realmente importar?"
            description="Esta ação não pode ser desfeita. Todos as solicitações importadas serão adicionadas"
            action={() => fileInputRef.current && fileInputRef.current.click()}
          >
            <div>
              {!isPending ? (
                <>Importar Planilha</>
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
