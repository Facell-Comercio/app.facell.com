import AlertPopUp from "@/components/custom/AlertPopUp";
import { InputFile } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { exportToExcel } from "@/helpers/importExportXLS";
import { api } from "@/lib/axios";
import ModalLogsMovimentoArquivos from "@/pages/financeiro/components/ModalLogsMovimentoArquivos";
import { useQueryClient } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { History, Save } from "lucide-react";
import { useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import ButtonExportManual from "./ButtonExportManual";

const TimGU = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [modalHistoricoOpen, setModalHistoricoOpen] = useState<boolean>(false);
  const [type, setType] = useState<string>("tim");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmitTim = async (form: FormData) => {
    await api.postForm("/comercial/comissionamento/configuracoes/import/tim-gu", form);
    queryClient.invalidateQueries({ queryKey: ["comercial"] });
    toast({
      variant: "success",
      title: "Relatório importado com sucesso!",
    });
  };

  const handleSubmitManual = async (form: FormData) => {
    const data = await api
      .postForm("/comercial/comissionamento/configuracoes/import/tim-gu-manual", form)
      .then((result) => result.data);
    queryClient.invalidateQueries({ queryKey: ["comercial"] });
    toast({
      variant: "success",
      title: "Sucesso!",
      description: "Relatório importado com sucesso!",
      action: (
        <ToastAction
          altText="Ver Resultados"
          onClick={() =>
            exportToExcel(
              data,
              `RESULTADO IMPORTAÇÃO TIM VENDAS ${formatDate(new Date(), "dd-MM-yyyy hh.mm")}`
            )
          }
        >
          Ver Resultados
        </ToastAction>
      ),
    });
  };

  const handleSubmit = async () => {
    try {
      const files = fileInputRef.current?.files;

      if (!files || files.length == 0) {
        throw new Error("Selecione um arquivo");
      }

      const form = new FormData();
      form.append("file", files[0]);

      if (type === "tim") {
        await handleSubmitTim(form);
      } else if (type === "manual") {
        await handleSubmitManual(form);
      } else {
        throw new Error("Tipo de importação inválido");
      }

      setIsLoading(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ops!",
        // @ts-ignore
        description: error?.response?.data?.message || error?.message,
      });
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
        fileInputRef.current.files = null;
      }
    }
  };

  return (
    <section className="flex flex-col gap-2">
      <div className="flex justify-between items-center font-medium">
        <span>TIM GU</span>
        <span className="flex gap-2">
          <ButtonExportManual />
          <Button variant={"outline"} onClick={() => setModalHistoricoOpen(true)}>
            <History size={18} className="me-2" />
            Histórico
          </Button>
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="flex flex-1 flex-col gap-2">
          <label className="text-sm font-medium">Tipo de Importação</label>
          <Select
            value={type}
            onValueChange={(value) => {
              setType(value);
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="h-8 text-xs sm:text-sm  uppercase">
              <SelectValue placeholder={"Tipo de Importação"} />
            </SelectTrigger>
            <SelectContent side="top">
              {["tim", "manual"].map((type) => (
                <SelectItem key={`tipo-importacao:${type}`} value={`${type}`} className="uppercase">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </span>
        <InputFile
          label="Arquivo"
          disabled={isLoading}
          className="flex-1"
          inputClass="bg-secondary "
          accept=".xlsx, .xls, .csv"
          fileInputRef={fileInputRef}
        />
        <span className="w-full flex gap-2 justify-end">
          <AlertPopUp
            title="Deseja realizar a importação?"
            description="Essa ação não pode ser desfeita. O arquivo será lido e as alterações persistidas no servidor."
            action={handleSubmit}
          >
            <Button disabled={isLoading}>
              {isLoading ? (
                <>
                  <FaSpinner size={18} className="me-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={18} className="me-2" />
                  Salvar
                </>
              )}
            </Button>
          </AlertPopUp>
        </span>
      </div>
      <ModalLogsMovimentoArquivos
        open={modalHistoricoOpen}
        // @ts-ignore
        onOpenChange={(val) => {
          setModalHistoricoOpen(val);
        }}
        relatorios={["IMPORT_TIM_GESTAO_USUARIOS", "IMPORT_TIM_GESTAO_USUARIOS_MANUAL"]}
      />
    </section>
  );
};

export default TimGU;
