import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { checkUserDepartments, checkUserPermission } from "@/helpers/checkAuthorization";
import { Link, Navigate, useLocation } from "react-router-dom";
import ConciliacaoCP from "./conciliacao/cp/ConciliacaoPagamentos";
import ConciliacaoCR from "./conciliacao/cr/ConciliacaoRecebimentos";
import ConfigTab from "./config/ConfigTab";
import ExtratoTab from "./extrato/ExtratoTab";
import Filters from "./Filters";

const ConciliacaoBancaria = () => {
  const uri = `/financeiro/conciliacao-bancaria`;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "";

  const authorized = checkUserDepartments("FINANCEIRO") || checkUserPermission("MASTER");
  if (!authorized) {
    return <Navigate to={"/not-authorized"} />;
  }
  return (
    <div className="flex flex-col gap-3 p-4">
      <Filters />

      <Tabs defaultValue={activeTab || "extratos"} className="w-full">
        <TabsList className="w-full justify-start">
          <ScrollArea className="w-full whitespace-nowrap rounded-md h-auto">
            <Link to={`${uri}?tab=extratos`}>
              <TabsTrigger value="extratos">Extratos Bancários</TabsTrigger>
            </Link>
            <Link to={`${uri}?tab=conciliacao-cp`}>
              <TabsTrigger value="conciliacao-cp">Conciliação de Pagamentos</TabsTrigger>
            </Link>
            <Link to={`${uri}?tab=conciliacao-cr`}>
              <TabsTrigger value="conciliacao-cr">Conciliação de Recebimentos</TabsTrigger>
            </Link>
            <Link to={`${uri}?tab=config`}>
              <TabsTrigger value="config">Configurações</TabsTrigger>
            </Link>
          </ScrollArea>
        </TabsList>
        <TabsContent value="extratos">
          <ExtratoTab />
        </TabsContent>
        <TabsContent value="conciliacao-cp">
          <ConciliacaoCP />
        </TabsContent>
        <TabsContent value="conciliacao-cr">
          <ConciliacaoCR />
        </TabsContent>
        <TabsContent value="config">
          <ConfigTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConciliacaoBancaria;
