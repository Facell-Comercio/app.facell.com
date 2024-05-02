import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  checkUserDepartments,
  checkUserPermission,
} from "@/helpers/checkAuthorization";
import Borderos from "./components/borderos/Borderos";
import TitulosPagar from "./components/titulos/TitulosPagar";

const ContasPagarPage = () => {
  return (
    <div className="flex p-4">
      <Tabs defaultValue="titulo" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="titulo">Solicitações</TabsTrigger>
          {(checkUserPermission("MASTER") ||
            checkUserDepartments("FINANCEIRO")) && (
            <>
              <TabsTrigger value="bordero">Borderôs</TabsTrigger>
              <TabsTrigger value="conciliacao">Conciliação</TabsTrigger>
              <TabsTrigger value="movimento-contabil">Movimento Contábil</TabsTrigger>
            </>
          )}
        </TabsList>
        <TabsContent value="titulo">
          <TitulosPagar />
        </TabsContent>
        <TabsContent value="bordero">
          <Borderos />
        </TabsContent>
        <TabsContent value="conciliacao"></TabsContent>
        <TabsContent value="movimento-contabil"></TabsContent>
      </Tabs>
    </div>
  );
};

export default ContasPagarPage;
