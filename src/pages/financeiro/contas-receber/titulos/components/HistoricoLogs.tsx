import { Button } from "@/components/ui/button";
import ModalLogsMovimentoArquivos from "@/pages/financeiro/components/ModalLogsMovimentoArquivos";
import { History } from "lucide-react";
import { useState } from "react";

const RELATORIOS = ["EXPORT_REMESSA_BOLETO_CAIXA", "IMPORT_RETORNO_BOLETO_CAIXA"];

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
        Histórico
      </Button>
    </>
  );
};

export default HistoricoLogs;
