import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  checkUserDepartments,
  checkUserPermission,
} from "@/helpers/checkAuthorization";
import Bancos from "./components/bancos/Bancos";
import CentroCustos from "./components/centro-de-custos/CentroCustos";
import ContasBancarias from "./components/contas-bancarias/ContasBancarias";
import Fornecedores from "./components/fornecedores/Fornecedores";
import PlanoContas from "./components/plano-de-contas/PlanoContas";

// import { useAuthStore } from "@/context/auth-store";

const CadastrosPage = () => {
  //   const user = useAuthStore(state=>state.user)

  return (
    <div className="flex p-4">
      <Tabs defaultValue="fornecedores" className="w-full">
        <TabsList className="w-full justify-start flex">
          <ScrollArea className="min-w-[1000px]">
            <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
            {checkUserDepartments("FINANCEIRO") ||
              (checkUserPermission("MASTER") && (
                <TabsTrigger value="plano-contas">Plano de Contas</TabsTrigger>
              ))}
            {checkUserDepartments("FINANCEIRO") ||
              (checkUserPermission("MASTER") && (
                <TabsTrigger value="centro-custos">Centro de Custo</TabsTrigger>
              ))}
            {checkUserDepartments("FINANCEIRO") ||
              (checkUserPermission("MASTER") && (
                <TabsTrigger value="bancos">Bancos</TabsTrigger>
              ))}
            {checkUserDepartments("FINANCEIRO") ||
              (checkUserPermission("MASTER") && (
                <TabsTrigger value="contas-bancarias">
                  Contas Bancarias
                </TabsTrigger>
              ))}
          </ScrollArea>
        </TabsList>
        <TabsContent value="fornecedores">
          <Fornecedores />
        </TabsContent>
        <TabsContent value="plano-contas">
          <PlanoContas />
        </TabsContent>
        <TabsContent value="centro-custos">
          <CentroCustos />
        </TabsContent>
        <TabsContent value="bancos">
          <Bancos />
        </TabsContent>
        <TabsContent value="contas-bancarias">
          <ContasBancarias />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CadastrosPage;
