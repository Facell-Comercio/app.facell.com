import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  checkUserDepartments,
  checkUserPermission,
} from "@/helpers/checkAuthorization";
import Cadastros from "./components/cadastros/Cadastros";
import MeuOrcamento from "./components/meu-orcamento/MeuOrcamento";

// import { useAuthStore } from "@/context/auth-store";

const OrcamentoPage = () => {
  //   const user = useAuthStore(state=>state.user)

  return (
    <div className="flex p-4">
      <Tabs defaultValue="meu-orcamento" className="w-full">
        <TabsList className="w-full justify-start flex h-auto">
          <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-2 md:p-0 h-auto">
            <TabsTrigger value="meu-orcamento">Meu Orçamento</TabsTrigger>
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
