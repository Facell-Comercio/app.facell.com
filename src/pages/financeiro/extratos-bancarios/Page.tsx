import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  checkUserDepartments,
  checkUserPermission,
} from "@/helpers/checkAuthorization";
import { Navigate } from "react-router-dom";
import ConciliacaoCP from "./conciliacao/cp/ConciliacaoPagamentos";
import ConfigTab from "./config/ConfigTab";
import ExtratoTab from "./extrato/ExtratoTab";
import Filters from "./Filters";

const ConciliacaoBancaria = () => {
  const authorized =
    checkUserDepartments("FINANCEIRO") || checkUserPermission("MASTER");
  if (!authorized) {
    return <Navigate to={"/not-authorized"} />;
  }
  return (
    <div className="flex flex-col gap-3 p-4">
      <Filters/>

      <Tabs defaultValue="extratos" className="w-full">
        <TabsList className="w-full justify-start">
          <ScrollArea className="w-full whitespace-nowrap rounded-md h-auto">
            <TabsTrigger value="extratos">Extratos Bancários</TabsTrigger>
            <TabsTrigger value="conciliacao">
              Conciliação de Pagamentos
            </TabsTrigger>
            <TabsTrigger value="config">Configurações</TabsTrigger>
          </ScrollArea>
        </TabsList>
        <TabsContent value="extratos">
          <ExtratoTab />
        </TabsContent>
        <TabsContent value="conciliacao">
          <ConciliacaoCP />
        </TabsContent>
        <TabsContent value="config">
          <ConfigTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConciliacaoBancaria;
