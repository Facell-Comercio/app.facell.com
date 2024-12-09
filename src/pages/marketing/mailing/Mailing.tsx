import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { checkUserDepartments, hasPermission } from "@/helpers/checkAuthorization";
import { Link, useLocation } from "react-router-dom";
import Campanhas from "./campanhas/Campanhas";
import Clientes from "./clientes/Clientes";

const MailingPage = () => {
  const uri = `/marketing/mailing`;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "";
  const isGestor = checkUserDepartments("MARKETING", true) || hasPermission("MASTER");

  return (
    <div className="flex p-4">
      <Tabs defaultValue={activeTab || "clientes"} className="w-full">
        <TabsList className="w-full justify-start flex h-auto">
          <ScrollArea className="w-fill whitespace-nowrap rounded-md h-auto">
            {isGestor && (
              <Link to={`${uri}?tab=clientes`}>
                <TabsTrigger value="clientes">Clientes</TabsTrigger>
              </Link>
            )}
            <Link to={`${uri}?tab=campanhas`}>
              <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
            </Link>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </TabsList>
        {isGestor && (
          <TabsContent value="clientes">
            <Clientes />
          </TabsContent>
        )}
        <TabsContent value="campanhas">
          <Campanhas />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MailingPage;
