import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hasPermission } from "@/helpers/checkAuthorization";
import { Link, useLocation } from "react-router-dom";
import ComercialConfiguracoes from "./configuracoes/ComercialConfiguracoes";
import Espelhos from "./espelhos/Espelhos";
import Politicas from "./politicas/Politicas";
import VendasInvalidadas from "./vendas-invalidas/VendasInvalidadas";

const ComercialComissionamento = () => {
  const uri = `/comercial/comissionamento`;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "";

  return (
    <div className="flex flex-col gap-2 p-4">
      <Tabs defaultValue={activeTab || "espelhos"} className="w-full">
        <TabsList className="w-full justify-start">
          <ScrollArea className="w-full whitespace-nowrap rounded-md h-auto">
            {hasPermission(["MASTER", "COMISSOES:ESPELHOS_VER"]) && (
              <Link to={`${uri}?tab=espelhos`}>
                <TabsTrigger value="espelhos">Espelhos</TabsTrigger>
              </Link>
            )}
            {hasPermission(["MASTER", "COMISSOES:VENDAS_INVALIDAS_VER"]) && (
              <Link to={`${uri}?tab=vendas-invalidadas`}>
                <TabsTrigger value="vendas-invalidadas">Vendas Inválidas</TabsTrigger>
              </Link>
            )}
            {hasPermission(["MASTER", "COMISSOES:POLITICAS_VER"]) && (
              <Link to={`${uri}?tab=politica`}>
                <TabsTrigger value="politica">Política</TabsTrigger>
              </Link>
            )}
            {hasPermission(["MASTER", "COMISSOES:CONFIGURACOES"]) && (
              <Link to={`${uri}?tab=configuracao`}>
                <TabsTrigger value="configuracao">Configuração</TabsTrigger>
              </Link>
            )}
            <ScrollBar orientation="horizontal" thumbColor="dark:bg-slate-400 bg-gray-450" />
          </ScrollArea>
        </TabsList>

        {hasPermission(["MASTER", "COMISSOES:ESPELHOS_VER"]) && (
          <TabsContent value="espelhos">
            <Espelhos />
          </TabsContent>
        )}
        {hasPermission(["MASTER", "COMISSOES:VENDAS_INVALIDAS_VER"]) && (
          <TabsContent value="vendas-invalidadas">
            <VendasInvalidadas />
          </TabsContent>
        )}
        {hasPermission(["MASTER", "COMISSOES:POLITICAS_VER"]) && (
          <TabsContent value="politica">
            <Politicas />
          </TabsContent>
        )}
        {hasPermission(["MASTER", "COMISSOES:CONFIGURACOES"]) && (
          <TabsContent value="configuracao">
            <ComercialConfiguracoes />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ComercialComissionamento;
