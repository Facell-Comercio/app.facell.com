// import { useAuthStore } from "@/context/auth-store";

import { checkUserDepartments, checkUserPermission } from "@/helpers/checkAuthorization";
import ContasPagarRelatorio from "./contas-a-pagar/ContasPagarRelatorios";
import ContasReceberRelatorios from "./contas-a-receber/ContasReceberRelatorios";
import ControleCaixaRelatorios from "./controle-caixa/ControleCaixaRelatorio";
import DRERelatorios from "./dre/DRERelatorios";

const RelatoriosPage = () => {
  const isMaster = checkUserPermission("MASTER") || checkUserDepartments("FINANCEIRO");

  return (
    <div className="flex flex-col gap-2 p-4">
      <ContasPagarRelatorio />
      <ContasReceberRelatorios />
      <ControleCaixaRelatorios />
      {isMaster && <DRERelatorios />}
    </div>
  );
};

export default RelatoriosPage;
