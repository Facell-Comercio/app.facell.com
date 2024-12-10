import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/context/auth-store";
import { Navigate } from 'react-router-dom';
import Estoque from "./estoque/Estoque";
import Departamentos from "@/pages/admin/departamentos/Departamentos";
import Filiais from "@/pages/admin/filiais/Filiais";


const Perfil = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore().user;
  if (!user?.id) {
    return <Navigate to={'/login'}/>;
  }
}

const FardamentoPage = () => {
  return (
    <div className="flex p-4">
      <Tabs defaultValue="estoque" className="w-full">
        <TabsList className="w-full justify-start">
          <ScrollArea className="w-full whitespace-nowrap rounded-md h-auto">
            <TabsTrigger value="estoque">Estoque</TabsTrigger>
            <TabsTrigger value="departamentos">Movimentação</TabsTrigger>
            <TabsTrigger value="filiais">Configuração</TabsTrigger>
            <ScrollBar
              orientation="horizontal"
              thumbColor="dark:bg-slate-400 bg-gray-450"
            />
          </ScrollArea>
        </TabsList>
        <TabsContent value="estoque">
          <Estoque/>
        </TabsContent>
        <TabsContent value="departamentos">
          <Departamentos />
        </TabsContent>
        <TabsContent value="filiais">
          <Filiais />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FardamentoPage;
