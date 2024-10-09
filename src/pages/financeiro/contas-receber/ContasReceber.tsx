import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { checkUserDepartments, checkUserPermission } from "@/helpers/checkAuthorization";

import { Link, useLocation } from "react-router-dom";
import MovimentoContabilReceber from "./movimento-contabil/MovimentoContabil";
import { PainelContasReceber } from "./painel/PainelContasReceber";
import TitulosReceber from "./titulos/TitulosReceber";

const ContasReceberPage = () => {
  const uri = `/financeiro/contas-a-receber`;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "";

  return (
    <div className="flex p-4">
      <Tabs defaultValue={activeTab || "painel"} className="w-full">
        <TabsList className="w-full justify-start">
          <ScrollArea className="w-full whitespace-nowrap rounded-md h-auto">
            {(checkUserPermission("MASTER") || checkUserDepartments("FINANCEIRO")) && (
              <>
                <Link to={`${uri}?tab=painel`}>
                  <TabsTrigger value="painel">Painel</TabsTrigger>
                </Link>
                <Link to={`${uri}?tab=titulo`}>
                  <TabsTrigger value="titulo">Títulos</TabsTrigger>
                </Link>
                <Link to={`${uri}?tab=movimento-contabil`}>
                  <TabsTrigger value="movimento-contabil">Movimento Contábil</TabsTrigger>
                </Link>
              </>
            )}
            <ScrollBar orientation="horizontal" thumbColor="dark:bg-slate-400 bg-gray-450" />
          </ScrollArea>
        </TabsList>
        <TabsContent value="painel">
          <PainelContasReceber />
        </TabsContent>
        <TabsContent value="titulo">
          <TitulosReceber />
        </TabsContent>
        <TabsContent value="movimento-contabil">
          <MovimentoContabilReceber />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContasReceberPage;
