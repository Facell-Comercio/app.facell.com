import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { checkUserDepartments, checkUserPermission } from "@/helpers/checkAuthorization";
import { useState } from "react";
import DatasysRelatorio from "./datasys/DatasysRelatorio";
import DespesasRelatorio from "./despesas/DespesasRelatorio";
import PrevisaoPagamentoRelatorio from "./previsao-pagamento/PrevisaoPagamentoRelatorio";
import SolicitacoesCriadasRelatorio from "./solicitacoes-criadas/SolicitacoesCriadasRelatorio";
import VencimentosRelatorio from "./vencimentos/VencimentosRelatorio";

const ContasPagarRelatorios = () => {
  const [itemOpen, setItemOpen] = useState("");
  const isMaster = checkUserPermission("MASTER") || checkUserDepartments("FINANCEIRO");
  const canExportDespesas = isMaster || checkUserPermission("FINANCEIRO_EXPORTAR_DESPESAS");
  return (
    <Accordion type="single" collapsible className="p-2 border dark:border-slate-800 rounded-lg ">
      <AccordionItem value="item-1" className="relative border-0">
        <AccordionTrigger className={`py-1 hover:no-underline`}>Contas a Pagar</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 p-0 pt-3">
          <SolicitacoesCriadasRelatorio itemOpen={itemOpen} setItemOpen={setItemOpen} />
          <VencimentosRelatorio itemOpen={itemOpen} setItemOpen={setItemOpen} />
          {canExportDespesas && <DespesasRelatorio itemOpen={itemOpen} setItemOpen={setItemOpen} />}
          {isMaster && <PrevisaoPagamentoRelatorio itemOpen={itemOpen} setItemOpen={setItemOpen} />}
          <DatasysRelatorio itemOpen={itemOpen} setItemOpen={setItemOpen} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ContasPagarRelatorios;
