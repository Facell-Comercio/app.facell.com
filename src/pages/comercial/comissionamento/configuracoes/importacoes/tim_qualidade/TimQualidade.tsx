import AlertPopUp from "@/components/custom/AlertPopUp";
import { InputFile } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import ModalLogsMovimentoArquivos from "@/pages/financeiro/components/ModalLogsMovimentoArquivos";
import { useQueryClient } from "@tanstack/react-query";
import { History, Save } from "lucide-react";
import { useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa6";

const TimQualidade = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [modalHistoricoOpen, setModalHistoricoOpen] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleChangeFile = async () => {
    try {
      const files = fileInputRef.current?.files;
      if (!files || files.length == 0) {
        throw new Error("Selecione um arquivo");
      }

      setIsLoading(true);
      const form = new FormData();

      if (files) {
        Array.from(files).forEach((file) => {
          form.append("files", file);
        });
      }

      await api.postForm("comercial/comissionamento/configuracoes/import/tim-qualidade", form);
      queryClient.invalidateQueries({ queryKey: ["comercial"] });
      toast({
        variant: "success",
        title: "Relatório importado com sucesso!",
      });
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
      }
    }
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="flex justify-between items-center font-medium">
        <span>TIM Qualidade</span>
        <Button variant={"outline"} onClick={() => setModalHistoricoOpen(true)}>
          <History size={18} className="me-2" />
          Histórico
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <InputFile
          label="Arquivo"
          disabled={isLoading}
          className="flex-1"
          inputClass="bg-secondary "
          accept=".xlsx, .xls, .csv"
          multiple
          fileInputRef={fileInputRef}
        />
        <span className="w-full flex gap-2 justify-end">
          <AlertPopUp
            title="Deseja realizar a importação?"
            description="Essa ação não pode ser desfeita. O arquivo será lido e as alterações persistidas no servidor."
            action={handleChangeFile}
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
        relatorios={["IMPORT_TIM_QUALIDADE"]}
      />
    </section>
  );
};

export default TimQualidade;
