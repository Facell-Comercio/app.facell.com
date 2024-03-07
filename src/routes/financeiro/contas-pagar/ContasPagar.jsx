import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Titulo from "./components/titulo";

const ContasPagarPage = () => {
  return (
    <div className='flex p-4 border'>
        <Tabs defaultValue="titulos" className="w-full border" >
        <TabsList className='w-full justify-start'>
            <TabsTrigger value="titulos">Titulos</TabsTrigger>
            <TabsTrigger value="borderos">Borderôs</TabsTrigger>
            <TabsTrigger value="conciliacoes">Conciliação</TabsTrigger>
        </TabsList>
        <TabsContent value="titulos"></TabsContent>
        <TabsContent value="borderos"></TabsContent>
        <TabsContent value="conciliacoes"></TabsContent>
        </Tabs>
    </div>
  );
};

export default ContasPagarPage;
