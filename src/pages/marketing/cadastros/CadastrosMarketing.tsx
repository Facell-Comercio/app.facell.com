import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { checkUserDepartments, checkUserPermission } from "@/helpers/checkAuthorization";
import { Link, useLocation } from "react-router-dom";
import InteracoesManuais from "./interacoes-manuais/InteracoesManuais";
import Planos from "./planos/Planos";
import Vendedores from "./vendedores/Vendedores";

const CadastrosMarketingPage = () => {
  const uri = `/marketing/cadastros`;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "";
  const isGestor = checkUserDepartments("MARKETING", true) || checkUserPermission("MASTER");

  return (
    <div className="flex p-4">
      <Tabs defaultValue={activeTab || "vendedores"} className="w-full">
        <TabsList className="w-full justify-start flex h-auto">
          <ScrollArea className="w-fill whitespace-nowrap rounded-md h-auto">
            <Link to={`${uri}?tab=vendedores`}>
              <TabsTrigger value="vendedores">Vendedores</TabsTrigger>
            </Link>
            {isGestor && (
              <>
                <Link to={`${uri}?tab=planos`}>
                  <TabsTrigger value="planos">Planos</TabsTrigger>
                </Link>
                <Link to={`${uri}?tab=interacoes-manuais`}>
                  <TabsTrigger value="interacoes-manuais">Interações Manuais</TabsTrigger>
                </Link>
              </>
            )}

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TabsList>
        <TabsContent value="vendedores">
          <Vendedores />
        </TabsContent>
        <TabsContent value="planos">
          <Planos />
        </TabsContent>
        <TabsContent value="interacoes-manuais">
          <InteracoesManuais />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CadastrosMarketingPage;
