import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  checkUserDepartments,
  checkUserPermission,
} from "@/helpers/checkAuthorization";
import Borderos from "./borderos/Borderos";
import MovimentoContabil from "./movimento-contabil/MoviementoContabil";
import { PainelContasPagar } from "./painel/PainelContasPagar";
import TitulosPagar from "./titulos/TitulosPagar";
import Vencimentos from "./vencimentos/Vencimentos";

const ContasPagarPage = () => {
  return (
    <div className="flex p-4">
      <Tabs defaultValue="painel" className="w-full">
        <TabsList className="w-full justify-start">
          <ScrollArea className="w-full whitespace-nowrap rounded-md h-auto">
            <TabsTrigger value="painel">Painel</TabsTrigger>
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
            <ScrollBar
              orientation="horizontal"
              thumbColor="dark:bg-slate-400 bg-gray-450"
            />
          </ScrollArea>
        </TabsList>
        <TabsContent value="painel">
          <PainelContasPagar />
        </TabsContent>
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
