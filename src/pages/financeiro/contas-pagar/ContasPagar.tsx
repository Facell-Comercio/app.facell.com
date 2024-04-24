import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  checkUserDepartments,
  checkUserPermission,
} from "@/helpers/checkAuthorization";
import Borderos from "./components/borderos/Borderos";
import TitulosPagar from "./components/titulos/TitulosPagar";

const ContasPagarPage = () => {
  console.log(checkUserDepartments("FINANCEIRO"));

  return (
    <div className="flex p-4">
      <Tabs defaultValue="titulos" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="titulos">Solicitações</TabsTrigger>
          {(checkUserPermission("MASTER") ||
            checkUserDepartments("FINANCEIRO")) && (
            <>
              <TabsTrigger value="borderos">Borderôs</TabsTrigger>
              <TabsTrigger value="conciliacoes">Conciliação</TabsTrigger>
            </>
          )}
        </TabsList>
        <TabsContent value="titulos">
          <TitulosPagar />
        </TabsContent>
        <TabsContent value="borderos">
          <Borderos />
        </TabsContent>
        <TabsContent value="conciliacoes"></TabsContent>
      </Tabs>
    </div>
  );
};

export default ContasPagarPage;
