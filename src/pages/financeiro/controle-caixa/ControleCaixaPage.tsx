import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "react-router-dom";
import Boletos from "./boletos/Boletos";
import ConferenciaCaixa from "./conferencia-caixa/ConferenciaCaixa";
import ImportacoesTab from "./importacoes/ImportacoesTab";

const ControleCaixaPage = () => {
  const uri = `/financeiro/controle-de-caixa`;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "";

  return (
    <div className="flex p-4">
      <Tabs
        defaultValue={activeTab || "conferencia-de-caixa"}
        className="w-full flex flex-col gap-1"
      >
        <TabsList className="w-full justify-start">
          <ScrollArea className="w-full whitespace-nowrap rounded-md h-auto">
            <Link to={`${uri}/conferencia-de-caixa`}>
              <TabsTrigger value="conferencia-de-caixa">Conferência de Caixa</TabsTrigger>
            </Link>
            <Link to={`${uri}?tab=boletos`}>
              <TabsTrigger value="boletos">Boletos</TabsTrigger>
            </Link>
            <Link to={`${uri}?tab=importacoes`}>
              <TabsTrigger value="importacoes">Importações</TabsTrigger>
            </Link>
            <ScrollBar orientation="horizontal" thumbColor="dark:bg-slate-400 bg-gray-450" />
          </ScrollArea>
        </TabsList>
        <TabsContent value="conferencia-de-caixa">
          <ConferenciaCaixa />
        </TabsContent>
        <TabsContent value="boletos">
          <Boletos />
        </TabsContent>
        <TabsContent value="importacoes">
          <ImportacoesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ControleCaixaPage;
