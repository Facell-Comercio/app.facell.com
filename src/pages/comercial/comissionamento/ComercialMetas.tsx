import {
  ScrollArea,
  ScrollBar,
} from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Link,
  useLocation,
} from "react-router-dom";
import Espelhos from "./espelhos/Espelhos";
import Politicas from "./politicas/Politicas";
import VendasInvalidas from "./vendas-invalidas/VendasInvalidas";

const ComercialComissionamento = () => {
  const uri = `/comercial/comissionamento`;
  const location = useLocation();
  const searchParams = new URLSearchParams(
    location.search
  );
  const activeTab = searchParams.get("tab") || "";

  return (
    <div className="flex flex-col gap-2 p-4">
      <Tabs
        defaultValue={activeTab || "espelhos"}
        className="w-full"
      >
        <TabsList className="w-full justify-start">
          <ScrollArea className="w-full whitespace-nowrap rounded-md h-auto">
            <Link to={`${uri}?tab=espelhos`}>
              <TabsTrigger value="espelhos">
                Espelhos
              </TabsTrigger>
            </Link>
            <Link
              to={`${uri}?tab=vendas-invalidas`}
            >
              <TabsTrigger value="vendas-invalidas">
                Vendas Inválidas
              </TabsTrigger>
            </Link>
            <Link to={`${uri}?tab=politica`}>
              <TabsTrigger value="politica">
                Política
              </TabsTrigger>
            </Link>
            <Link to={`${uri}?tab=configuracao`}>
              <TabsTrigger value="configuracao">
                Configuração
              </TabsTrigger>
            </Link>
            <ScrollBar
              orientation="horizontal"
              thumbColor="dark:bg-slate-400 bg-gray-450"
            />
          </ScrollArea>
        </TabsList>

        <TabsContent value="espelhos">
          <Espelhos />
        </TabsContent>
        <TabsContent value="vendas-invalidas">
          <VendasInvalidas />
        </TabsContent>
        <TabsContent value="politica">
          <Politicas />
        </TabsContent>
        <TabsContent value="configuracao">
          {/* Configuração */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComercialComissionamento;
