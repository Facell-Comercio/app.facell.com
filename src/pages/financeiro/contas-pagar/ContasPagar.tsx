import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  checkUserDepartments,
  checkUserPermission,
} from "@/helpers/checkAuthorization";
import Borderos from "./borderos/Borderos";
import MovimentoContabil from "./movimento-contabil/MoviementoContabil";
import TitulosPagar from "./titulos/TitulosPagar";
import Vencimentos from "./vencimentos/Vencimentos";

const ContasPagarPage = () => {
  return (
    <div className="flex p-4">
      <Tabs defaultValue="vencimentos" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="titulo">Solicitações</TabsTrigger>
          {(checkUserPermission("MASTER") ||
            checkUserDepartments("FINANCEIRO")) && (
            <>
              <TabsTrigger value="vencimentos">Vencimentos</TabsTrigger>
              <TabsTrigger value="bordero">Borderôs</TabsTrigger>
              <TabsTrigger value="movimento-contabil">
                Movimento Contábil
              </TabsTrigger>
            </>
          )}
        </TabsList>
        <TabsContent value="titulo">
          <TitulosPagar />
        </TabsContent>
        <TabsContent value="vencimentos">
          <Vencimentos />
        </TabsContent>
        <TabsContent value="bordero">
          <Borderos />
        </TabsContent>
        <TabsContent value="movimento-contabil">
          <MovimentoContabil />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContasPagarPage;
