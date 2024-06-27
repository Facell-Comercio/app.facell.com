import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logs from "./adm-logs/Logs";
import Departamentos from "./departamentos/Departamentos";
import Filiais from "./filiais/Filiais";
import GruposEconomicos from "./grupos-economicos/GruposEconomicos";
import Users from "./users/Users";

const AdminPage = () => {
  return (
    <div className="flex p-4">
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="w-full justify-start">
          <ScrollArea className="w-full whitespace-nowrap rounded-md h-auto">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="departamentos">Departamentos</TabsTrigger>
            <TabsTrigger value="filiais">Filiais</TabsTrigger>
            <TabsTrigger value="gruposEconomicos">
              Grupos econômicos
            </TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <ScrollBar
              orientation="horizontal"
              thumbColor="dark:bg-slate-400 bg-gray-450"
            />
          </ScrollArea>
        </TabsList>
        <TabsContent value="users">
          <Users />
        </TabsContent>
        <TabsContent value="departamentos">
          <Departamentos />
        </TabsContent>
        <TabsContent value="filiais">
          <Filiais />
        </TabsContent>
        <TabsContent value="gruposEconomicos">
          <GruposEconomicos />
        </TabsContent>
        <TabsContent value="logs">
          <Logs />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
