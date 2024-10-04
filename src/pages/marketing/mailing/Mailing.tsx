import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Clientes from "./clientes/Clientes";

const MailingPage = () => {
  return (
    <div className="flex p-4">
      <Tabs defaultValue="clientes" className="w-full">
        <TabsList className="w-full justify-start flex h-auto">
          <ScrollArea className="w-fill whitespace-nowrap rounded-md h-auto">
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
            <TabsTrigger value="campanhas">Campanhas</TabsTrigger>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TabsList>
        <TabsContent value="clientes">
          <Clientes />
        </TabsContent>
        <TabsContent value="campanhas"></TabsContent>
      </Tabs>
    </div>
  );
};

export default MailingPage;
