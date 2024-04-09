import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  checkUserDepartments,
  checkUserPermission,
} from "@/helpers/checkAuthorization";
import Bancos from "./components/bancos/Bancos";
import CentroCustos from "./components/centro-de-custos/CentroCustos";
import ContasBancarias from "./components/contas-bancarias/ContasBancarias";
import EquipamentosCielo from "./components/equipamentos-cielo/EquipamentosCielo";
import Fornecedores from "./components/fornecedores/Fornecedores";
import PlanoContas from "./components/plano-de-contas/PlanoContas";
import Rateios from "./components/rateios/Rateios";

// import { useAuthStore } from "@/context/auth-store";

const CadastrosPage = () => {
  //   const user = useAuthStore(state=>state.user)

  return (
    <div className="flex p-4">
      <Tabs defaultValue="fornecedores" className="w-full">
        <TabsList className="w-full justify-start flex h-auto">
          <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-2 md:p-0 h-auto">
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
            <ScrollBar orientation="horizontal" />
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
