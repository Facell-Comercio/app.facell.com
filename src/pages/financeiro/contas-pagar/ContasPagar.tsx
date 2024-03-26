import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TitulosPagar from "./components/SectionTitulosPagar";
import { checkUserDepartments, checkUserPermission } from "@/helpers/checkAuthorization";

const ContasPagarPage = () => {
  console.log(checkUserDepartments('FINANCEIRO'))

  return (
    <div className='flex p-4'>
        <Tabs defaultValue="titulos" className="w-full" >
        <TabsList className='w-full justify-start'>
            <TabsTrigger value="titulos">Solicitações</TabsTrigger>
            {(checkUserPermission('MASTER') || checkUserDepartments('FINANCEIRO')) && (
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
