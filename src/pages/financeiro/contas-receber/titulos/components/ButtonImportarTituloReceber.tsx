import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToExcel } from "@/helpers/importExportXLS";
import { Upload } from "lucide-react";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { useTituloReceber } from "@/hooks/financeiro/useTituloReceber";
import { formatDate } from "date-fns";
import { ChangeEvent, useEffect, useRef, useState } from "react";
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
  const {
    mutate: lancamentoReembolsoTimZip,
    isPending: isPendingReembolsoTimZip,
    isSuccess: isSuccessReembolsoTimZip,
    data: resultadoLancamentoReembolsoTimZip,
  } = useTituloReceber().lancamentoReembolsoTimZip();
  const fileInputXLSXRef = useRef<HTMLInputElement>(null);
  const fileInputZIPRef = useRef<HTMLInputElement>(null);
  const [option, setOption] = useState<string | undefined>();

  const handleChangeImportXLSXButton = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const target = event.target;
    try {
      if (!target.files) return;
      const files = target.files;
      const form = new FormData();
      if (files) {
        Array.from(files).forEach((file) => {
          form.append(`files`, file);
        });
      }

      if (option === "reembolso_tim_lote") {
        lancamentoReembolsoTim(form);
      }
      if (option === "comissoes_tim_lote") {
        lancamentoComissoesTim(form);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao tentar importar o(s) arquivo(s)",
        // @ts-ignore
        description: error?.response?.data?.message || error?.message,
      });
    } finally {
      target.value = "";
    }
  };

  const handleChangeImportZIPButton = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const target = event.target;
    try {
      if (!target.files) return;
      const files = target.files;
      const form = new FormData();
      if (files) {
        Array.from(files).forEach((file) => {
          form.append(`files`, file);
        });
      }

      if (option === "reembolso_tim_zip") {
        lancamentoReembolsoTimZip(form);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao tentar importar o(s) arquivo(s)",
        // @ts-ignore
        description: error?.response?.data?.message || error?.message,
      });
    } finally {
      target.value = "";
    }
  };

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
                  "dd-MM-yyyy hh:mm"
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
                  "dd-MM-yyyy hh:mm"
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

  //* Mensagem Reembolso TIM ZIP
  useEffect(() => {
    if (isSuccessReembolsoTimZip && resultadoLancamentoReembolsoTimZip) {
      toast({
        title: "Sucesso",
        description: "Importação de reembolso TIM zip realizado",
        action: (
          <ToastAction
            altText="Ver Resultados"
            onClick={() =>
              exportToExcel(
                resultadoLancamentoReembolsoTimZip,
                `RESULTADO REEMBOLSO TIM ZIP ${formatDate(new Date(), "dd-MM-yyyy hh:mm")}`
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
  }, [isSuccessReembolsoTimZip]);

  const btnDisabled = isPendingReembolsoTim || isPendingComissoesTim || isPendingReembolsoTimZip;

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
              setOption("reembolso_tim_lote");
              fileInputXLSXRef.current && fileInputXLSXRef.current.click();
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
              setOption("comissoes_tim_lote");
              fileInputXLSXRef.current && fileInputXLSXRef.current.click();
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
        <DropdownMenuSeparator />
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
              setOption("reembolso_tim_zip");
              fileInputZIPRef.current && fileInputZIPRef.current.click();
            }}
          >
            <div>
              {!isPendingReembolsoTimZip ? (
                <>Reembolsos TIM - Arquivo ZIP</>
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
        ref={fileInputXLSXRef}
        multiple
        onChange={handleChangeImportXLSXButton}
        accept=".xlsx, .xls, .csv"
      />
      <input
        type="file"
        className="hidden"
        ref={fileInputZIPRef}
        multiple
        onChange={handleChangeImportZIPButton}
        accept=".zip"
      />
    </DropdownMenu>
  );
};

export default ButtonImportTitulosReceber;
