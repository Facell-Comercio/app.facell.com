import { Input } from "@/components/custom/FormInput";
import SelectMes from "@/components/custom/SelectMes";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hasPermission } from "@/helpers/checkAuthorization";
import { Link, useLocation } from "react-router-dom";
import Agregadores from "./Agregadores/Agregadores";
import Metas from "./Metas/Metas";
import { useStoreMetasAgregadores } from "./store-metas-agregadores";

const ComercialMetas = () => {
  const uri = `/comercial/metas`;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "";
  const [mes, ano, setMes, setAno] = useStoreMetasAgregadores((state) => [
    state.mes,
    state.ano,
    state.setMes,
    state.setAno,
  ]);

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex gap-2 w-full">
        <div className="flex-1">
          <span className="text-gray-500 text-sm font-medium">Mês</span>
          <SelectMes value={mes} onValueChange={(mes) => setMes(mes)} />
        </div>

        <div className="flex-1">
          <span className="text-gray-500 text-sm font-medium">Ano</span>
          <Input
            type="number"
            min={2023}
            value={ano}
            className="w-full"
            onChange={(value) => setAno(value.target.value)}
          />
        </div>
      </div>
      <Tabs defaultValue={activeTab || "metas"} className="w-full">
        <TabsList className="w-full justify-start">
          <ScrollArea className="w-full whitespace-nowrap rounded-md h-auto">
            {hasPermission(["METAS:METAS_VER", "MASTER"]) && (
              <Link to={`${uri}?tab=metas`}>
                <TabsTrigger value="metas">Metas</TabsTrigger>
              </Link>
            )}
            {hasPermission(["METAS:AGREGADORES_VER", "MASTER"]) && (
              <Link to={`${uri}?tab=agregadores`}>
                <TabsTrigger value="agregadores">Agregadores</TabsTrigger>
              </Link>
            )}
            <ScrollBar orientation="horizontal" thumbColor="dark:bg-slate-400 bg-gray-450" />
          </ScrollArea>
        </TabsList>
        {hasPermission(["METAS:METAS_VER", "MASTER"]) && (
          <TabsContent value="metas">
            <Metas />
          </TabsContent>
        )}
        {hasPermission(["METAS:AGREGADORES_VER", "MASTER"]) && (
          <TabsContent value="agregadores">
            <Agregadores />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ComercialMetas;
