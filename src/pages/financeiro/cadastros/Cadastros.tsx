import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  checkUserDepartments,
  checkUserPermission,
} from "@/helpers/checkAuthorization";
import Bancos from "./bancos/Bancos";
import CentroCustos from "./centro-de-custos/CentroCustos";
import ContasBancarias from "./contas-bancarias/ContasBancarias";
import EquipamentosCielo from "./equipamentos-cielo/EquipamentosCielo";
import Fornecedores from "./fornecedores/Fornecedores";
import PlanoContas from "./plano-de-contas/PlanoContas";
import Rateios from "./rateios/Rateios";
import { Navigate } from "react-router-dom";

// import { useAuthStore } from "@/context/auth-store";

const CadastrosPage = () => {
  const allowedUser = checkUserPermission('MASTER') || checkUserPermission('FINANCEIRO_SOLICITAR_PAGAMENTO') || checkUserDepartments('FINANCEIRO')
  if(!allowedUser){
    return <Navigate to={'/not-authorized'}/>
  }

  return (
    <div className="flex p-4">
      <Tabs defaultValue="fornecedores" className="w-full">
        <TabsList className="w-full justify-start flex h-auto">
          <ScrollArea className="w-full whitespace-nowrap rounded-md h-auto">
            <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
            {(checkUserDepartments("FINANCEIRO") ||
              checkUserPermission("MASTER")) && (
              <TabsTrigger value="plano-contas">Plano de Contas</TabsTrigger>
            )}
            {(checkUserDepartments("FINANCEIRO") ||
              checkUserPermission("MASTER")) && (
              <TabsTrigger value="centros-custos">Centros de Custo</TabsTrigger>
            )}
            {(checkUserDepartments("FINANCEIRO") ||
              checkUserPermission("MASTER")) && (
              <TabsTrigger value="bancos">Bancos</TabsTrigger>
            )}
            {(checkUserDepartments("FINANCEIRO") ||
              checkUserPermission("MASTER")) && (
              <TabsTrigger value="contas-bancarias">
                Contas Bancarias
              </TabsTrigger>
            )}
            {(checkUserDepartments("FINANCEIRO") ||
              checkUserPermission("MASTER")) && (
              <TabsTrigger value="equipamentos-cielo">
                Equipamentos Cielo
              </TabsTrigger>
            )}
            {(checkUserDepartments("FINANCEIRO") ||
              checkUserPermission("MASTER")) && (
              <TabsTrigger value="rateios">Rateios</TabsTrigger>
            )}
            <ScrollBar
              orientation="horizontal"
              thumbColor="dark:bg-slate-400 bg-gray-450"
            />
          </ScrollArea>
        </TabsList>
        <TabsContent value="fornecedores">
          <Fornecedores />
        </TabsContent>
        <TabsContent value="plano-contas">
          <PlanoContas />
        </TabsContent>
        <TabsContent value="centros-custos">
          <CentroCustos />
        </TabsContent>
        <TabsContent value="bancos">
          <Bancos />
        </TabsContent>
        <TabsContent value="contas-bancarias">
          <ContasBancarias />
        </TabsContent>
        <TabsContent value="equipamentos-cielo">
          <EquipamentosCielo />
        </TabsContent>
        <TabsContent value="rateios">
          <Rateios />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CadastrosPage;
