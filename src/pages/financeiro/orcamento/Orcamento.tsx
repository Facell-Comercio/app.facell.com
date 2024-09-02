import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  checkUserDepartments,
  checkUserPermission,
} from "@/helpers/checkAuthorization";
import Cadastros from "./components/cadastros/Cadastros";
import MeuOrcamento from "./components/meu-orcamento/MeuOrcamento";
import { Navigate } from "react-router-dom";

// import { useAuthStore } from "@/context/auth-store";

const OrcamentoPage = () => {
  const allowedUser = checkUserPermission('MASTER') || checkUserPermission('FINANCEIRO_SOLICITAR_PAGAMENTO') || checkUserDepartments('FINANCEIRO')
  if(!allowedUser){
    return <Navigate to={'/not-authorized'}/>
  }

  return (
    <div className="flex p-4">
      <Tabs defaultValue="meu-orcamento" className="w-full">
        <TabsList className="w-full justify-start flex h-auto">
          <ScrollArea className="w-fill whitespace-nowrap rounded-md h-auto">
            <TabsTrigger value="meu-orcamento">Acompanhamento</TabsTrigger>
            {(checkUserDepartments("FINANCEIRO") ||
              checkUserPermission("MASTER")) && (
              <TabsTrigger value="cadastros">Cadastro</TabsTrigger>
            )}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TabsList>
        <TabsContent value="meu-orcamento">
          <MeuOrcamento />
        </TabsContent>
        <TabsContent value="cadastros">
          <Cadastros />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrcamentoPage;
