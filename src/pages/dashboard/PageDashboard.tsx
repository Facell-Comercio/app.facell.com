import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "react-router-dom";
import { PowerBI } from "./powerbi/PowerBI";
import ParcialPage from "./parcial/ParcialPage";

export const PageDashboard = () => {
  const uri = `/dashboard`;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "";

  return (
    <div className="flex p-4 scroll-thin overflow-auto max-w-[100dvw]">
      <Tabs defaultValue={activeTab || "parcial"} className="w-full">
        <TabsList className="w-full justify-start">
          <ScrollArea className="w-full whitespace-nowrap rounded-md h-auto">
            <Link to={`${uri}?tab=parcial`}>
              <TabsTrigger value="parcial">Parcial</TabsTrigger>
            </Link>
            <Link to={`${uri}?tab=powerbi`}>
              <TabsTrigger value="powerbi">Power BI</TabsTrigger>
            </Link>
           
            <ScrollBar
              orientation="horizontal"
              thumbColor="dark:bg-slate-400 bg-gray-450"
            />
          </ScrollArea>
        </TabsList>
        <TabsContent value="parcial">
            <ParcialPage />
        </TabsContent>
        <TabsContent value="powerbi">
            <PowerBI/>
        </TabsContent>
      </Tabs>
    </div>
  );
};