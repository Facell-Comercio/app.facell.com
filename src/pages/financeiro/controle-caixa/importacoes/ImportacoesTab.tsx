import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { hasPermission } from "@/helpers/checkAuthorization";
import { useConferenciasCaixa } from "@/hooks/financeiro/useConferenciasCaixa";
import {
  ArrowUpDown,
  CreditCard,
  HandCoins,
  History,
  Landmark,
  Receipt,
  RefreshCcw,
  Shield,
} from "lucide-react";
import { useState } from "react";
import ModalLogsMovimentoArquivos from "../../components/ModalLogsMovimentoArquivos";
import ImportacaoCaixasLote from "./components/ImportacaoCaixasLote";
import ImportacaoItem from "./components/ImportacaoItem";

const RELATORIOS = [
  "CIELO-VENDAS",
  "PIX-ITAU",
  "PIX-BRADESCO",
  "RECARGA-RVCELLCARD",
  "PITZI-VENDAS",
  "RENOV-TRADEIN",
  "CREDIARIO-PAYJOY",
  "CREDIARIO-DIMO"
];

const ImportacoesTab = () => {
  const isMaster = hasPermission("MASTER");

  const [modalHistoricoOpen, setModalHistoricoOpen] = useState<boolean>(false);
  const { mutate: cruzarRelatoriosLote, isPending } = useConferenciasCaixa().cruzarRelatoriosLote();

  return (
    <Card>
      <CardHeader>
        <div className="flex flew-row justify-between gap-3">
          <div className="flex flex-col gap-2">
            <CardTitle>Importações</CardTitle>
            <CardDescription>
              Aqui você importa os relatórios que são necessários para os cruzamentos de informações
            </CardDescription>
          </div>
          <div>
            <ModalLogsMovimentoArquivos
              open={modalHistoricoOpen}
              // @ts-ignore
              onOpenChange={(val) => {
                setModalHistoricoOpen(val);
              }}
              relatorios={RELATORIOS}
            />
            <span className="flex gap-2">
              <Button
                onClick={() => cruzarRelatoriosLote()}
                className="flex gap-2"
                variant={"outline"}
                disabled={isPending}
                title="Passa por todos os caixas não baixados e realizando a apuração de divergência."
              >
                <RefreshCcw className={`${isPending && "animate-spin"}`} />{" "}
                {isPending ? "Reprocessando..." : "Reprocessar Caixas"}
              </Button>
              <Button
                onClick={() => setModalHistoricoOpen(true)}
                className="flex gap-2"
                variant={"outline"}
              >
                <History /> Histórico
              </Button>
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="flex flex-col gap-2">
          <ImportacaoItem icon={<CreditCard />} label="Cielo Vendas" uri="/import-cielo-vendas" />
          <ImportacaoItem icon={<Landmark />} label="PIX Bradesco" uri="/import-pix-bradesco" />
          <ImportacaoItem icon={<Landmark />} label="PIX Itaú" uri="/import-pix-itau" />
          <ImportacaoItem
            icon={<HandCoins />}
            label="Recarga RV Cellcard"
            uri="/import-recarga-rvcellcard"
          />
          <ImportacaoItem icon={<Shield />} label="Pitzi Vendas" uri="/import-pitzi-vendas" />
          <ImportacaoItem
            icon={<ArrowUpDown />}
            label="Renov Tradein"
            uri="/import-renov-tradein"
          />
          <ImportacaoItem icon={<Receipt />} label="Crediario - PAYJOY" uri="/import-crediario-payjoy" />
          <ImportacaoItem icon={<Receipt />} label="Crediario - DIMO" uri="/import-crediario-dimo" />

          {isMaster && <ImportacaoCaixasLote />}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ImportacoesTab;
