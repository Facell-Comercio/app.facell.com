import { Button } from "@/components/ui/button";
import ModalLogsMovimentoArquivos from "@/pages/financeiro/components/ModalLogsMovimentoArquivos";
import { History } from "lucide-react";
import { useState } from "react";

const RELATORIOS = ["IMPORT_REEMBOLSOS_TIM_ZIP"];

const HistoricoLogs = () => {
  const [modalHistoricoOpen, setModalHistoricoOpen] = useState<boolean>(false);
  return (
    <>
      <ModalLogsMovimentoArquivos
        open={modalHistoricoOpen}
        // @ts-ignore
        onOpenChange={(val) => {
          setModalHistoricoOpen(val);
        }}
        relatorios={RELATORIOS}
      />
      <Button
        variant={"outline"}
        className="border-secondary"
        onClick={() => setModalHistoricoOpen(true)}
      >
        <History size={18} className="me-2" />
        Histórico de Importações
      </Button>
    </>
  );
};

export default HistoricoLogs;
