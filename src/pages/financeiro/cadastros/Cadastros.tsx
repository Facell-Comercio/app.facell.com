import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionFornecedores from "./components/SectionFornecedores";

// import { useAuthStore } from "@/context/auth-store";

const CadastrosPage = () => {
//   const user = useAuthStore(state=>state.user)
  
  return (
    <div className='flex p-4'>
        <Tabs defaultValue="titulos" className="w-full" >
        <TabsList className='w-full justify-start flex gap-1'>
            <TabsTrigger value="titulos">Fornecedores</TabsTrigger>
            <TabsTrigger value="titulos">Plano de Contas</TabsTrigger>
            <TabsTrigger value="titulos">Centro de Custo</TabsTrigger>
        </TabsList>
        <TabsContent value="titulos">
          <SectionFornecedores/>
        </TabsContent>
        <TabsContent value="borderos"></TabsContent>
        <TabsContent value="conciliacoes"></TabsContent>
        </Tabs>
    </div>
  );
};
 
export default CadastrosPage;