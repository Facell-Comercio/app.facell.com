import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TitulosPagar from "./components/SectionTitulosPagar";

import { useAuthStore } from "@/context/auth-store";

const ContasPagarPage = () => {
  const user = useAuthStore(state=>state.user)
  
  return (
    <div className='flex p-4'>
        <Tabs defaultValue="titulos" className="w-full" >
        <TabsList className='w-full justify-start'>
            <TabsTrigger value="titulos">Solicitações</TabsTrigger>
            {user?.perfil === 'Master' || user?.perfil === 'Financeiro' && (
              <>
              <TabsTrigger value="borderos">Borderôs</TabsTrigger>
              <TabsTrigger value="conciliacoes">Conciliação</TabsTrigger>
              </>
            )}
        </TabsList>
        <TabsContent value="titulos">
          <TitulosPagar/>
        </TabsContent>
        <TabsContent value="borderos"></TabsContent>
        <TabsContent value="conciliacoes"></TabsContent>
        </Tabs>
    </div>
  );
};

export default ContasPagarPage;
