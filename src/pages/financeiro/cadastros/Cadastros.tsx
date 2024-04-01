import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Fornecedores from "./components/fornecedores/Fornecedores";
import PlanoContas from "./components/plano-de-contas/PlanoContas";

// import { useAuthStore } from "@/context/auth-store";

const CadastrosPage = () => {
  //   const user = useAuthStore(state=>state.user)

  return (
    <div className="flex p-4">
      <Tabs defaultValue="fornecedores" className="w-full">
        <TabsList className="w-full justify-start flex">
          <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
          <TabsTrigger value="plano-contas">Plano de Contas</TabsTrigger>
          <TabsTrigger value="centro-custos">Centro de Custo</TabsTrigger>
        </TabsList>
        <TabsContent value="fornecedores">
          <Fornecedores />
        </TabsContent>
        <TabsContent value="plano-contas">
          <PlanoContas />
        </TabsContent>
        <TabsContent value="centro-custos"></TabsContent>
      </Tabs>
    </div>
  );
};

export default CadastrosPage;
