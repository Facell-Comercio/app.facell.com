import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConciliacaoCP from "./conciliacao/cp/ConciliacaoCP";
import ConfigTab from "./config/ConfigTab";
import ExtratoTab from "./extrato/ExtratoTab";
import { checkUserDepartments, checkUserPermission } from "@/helpers/checkAuthorization";
import { Navigate } from "react-router-dom";

const ConciliacaoBancaria = () => {
  const authorized = checkUserDepartments('FINANCEIRO') || checkUserPermission('MASTER')
  if(!authorized){
    return <Navigate to={'/not-authorized'} />
  }
  return (
    <div className="flex p-4">
      <Tabs defaultValue="conciliacao" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="extratos">Extratos Bancários</TabsTrigger>
          <TabsTrigger value="conciliacao">Conciliação de pagamentos</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
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
