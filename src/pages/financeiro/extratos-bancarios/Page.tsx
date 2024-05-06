import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExtratoTab from "./extrato/ExtratoTab";
import ConciliacaoTab from "./conciliacao/ConciliacaoTab";
import ConfigTab from "./config/ConfigTab";

const ExtratosPage = () => {
  return (
    <div className="flex p-4">
      <Tabs defaultValue="extratos" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="extratos">Extratos Bancários</TabsTrigger>
          <TabsTrigger value="conciliacao">Conciliação</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
        </TabsList>
        <TabsContent value="extratos">
          <ExtratoTab />
        </TabsContent>
        <TabsContent value="conciliacao">
          <ConciliacaoTab />
        </TabsContent>
        <TabsContent value="config">
          <ConfigTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExtratosPage;
