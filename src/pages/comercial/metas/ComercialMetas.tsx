import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "react-router-dom";
import Metas from "./Metas/Metas";

const ComercialMetas = () => {
  const uri = `/comercial/metas`;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "";

  return (
    <div className="flex p-4">
      <Tabs defaultValue={activeTab || "metas"} className="w-full">
        <TabsList className="w-full justify-start">
          <ScrollArea className="w-full whitespace-nowrap rounded-md h-auto">
            <Link to={`${uri}?tab=metas`}>
              <TabsTrigger value="metas">Metas</TabsTrigger>
            </Link>
            <Link to={`${uri}?tab=agregadores`}>
              <TabsTrigger value="agregadores">Agregadores</TabsTrigger>
            </Link>
            <ScrollBar
              orientation="horizontal"
              thumbColor="dark:bg-slate-400 bg-gray-450"
            />
          </ScrollArea>
        </TabsList>
        <TabsContent value="metas">
          <Metas />
        </TabsContent>
        <TabsContent value="agregadores"></TabsContent>
      </Tabs>
    </div>
  );
};

export default ComercialMetas;
