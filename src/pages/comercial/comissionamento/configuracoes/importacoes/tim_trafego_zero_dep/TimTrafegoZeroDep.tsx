import AlertPopUp from "@/components/custom/AlertPopUp";
import { InputFile, InputWithLabel } from "@/components/custom/FormInput";
import SelectMes from "@/components/custom/SelectMes";
import { Button } from "@/components/ui/button";
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
import ButtonExportPadrao from "../components/ButtonExportPadrao";

const hrefPlanilhaPadrao =
  "https://docs.google.com/spreadsheets/d/1mSjvLtOf6zhk8L1oCo4O-VnvhqafyKKE/export?format=xlsx";

const initialFormData = {
  mes: "",
  ano: "",
};
const TimTrafegoZeroDep = () => {
  const [formData, setFormData] = useState(initialFormData);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [modalHistoricoOpen, setModalHistoricoOpen] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSubmit = async () => {
    try {
      const files = fileInputRef.current?.files;

      if (!files || files.length == 0) {
        throw new Error("Selecione um arquivo");
      }
      if (!formData.mes) {
        throw new Error("Selecione o mês!");
      }
      if (!formData.ano) {
        throw new Error("Selecione o ano!");
      }
      if (parseInt(formData.ano) < 2023) {
        throw new Error("Ano selecionado inválido!");
      }

      setIsLoading(true);
      const form = new FormData();

      form.append("file", files[0]);
      form.append("mes", formData.mes);
      form.append("ano", formData.ano);
      const data = await api
        .postForm("/comercial/comissionamento/configuracoes/import/tim-trafego-zero-dep", form)
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
                `RESULTADO IMPORTAÇÃO TIM TRAFEGO ZERO DEPENDENTES ${formatDate(
                  new Date(),
                  "dd-MM-yyyy hh.mm"
                )}`
              )
            }
          >
            Ver Resultados
          </ToastAction>
        ),
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
        <span>TIM Tráfego Zero Dependentes</span>
        <span className="flex gap-2">
          <ButtonExportPadrao href={hrefPlanilhaPadrao} />
          <Button variant={"outline"} onClick={() => setModalHistoricoOpen(true)}>
            <History size={18} className="me-2" />
            Histórico
          </Button>
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <span className="flex flex-1 flex-col gap-2">
            <label className="font-medium text-sm">Mês</label>
            <SelectMes
              value={formData.mes}
              placeholder="Selecione o Mês"
              onValueChange={(mes) => setFormData((prev) => ({ ...prev, mes }))}
            />
          </span>
          <InputWithLabel
            label="Ano"
            value={formData.ano}
            className="flex-1"
            type="number"
            min={2023}
            onChange={(e) => setFormData((prev) => ({ ...prev, ano: e.target.value }))}
          />
        </div>
        <InputFile
          label="Arquivo"
          disabled={isLoading}
          className="flex-1"
          inputClass="bg-secondary"
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
        relatorios={["IMPORT_TIM_TRAFEGO_ZERO_DEP"]}
      />
    </section>
  );
};

export default TimTrafegoZeroDep;
