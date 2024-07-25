import fetchApi from "@/api/fetchApi";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  checkUserDepartments,
  checkUserPermission,
} from "@/helpers/checkAuthorization";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import Borderos from "./borderos/Borderos";
import Cartoes from "./cartoes/Cartoes";
import MovimentoContabil from "./movimento-contabil/MovimentoContabil";
import { PainelContasPagar } from "./painel/PainelContasPagar";
import TitulosPagar from "./titulos/TitulosPagar";
import Vencimentos from "./vencimentos/Vencimentos";

const ContasPagarPage = () => {
  const uri = `/financeiro/contas-a-pagar`;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "";

  const queryClient = useQueryClient();

  queryClient.prefetchQuery({
    queryKey: ["financeiro", "forma_pagamento", "lista"],
    queryFn: async () => await fetchApi.financeiro.forma_pagamento.getAll(),
  });

  queryClient.prefetchQuery({
    queryKey: ["financeiro", "contas_pagar", "cartao", "lista", null],
    staleTime: Infinity,
    queryFn: async () =>
      await fetchApi.financeiro.contas_pagar.cartoes.getAll({}),
  });

  return (
    <div className="flex p-4">
      <Tabs defaultValue={activeTab || "painel"} className="w-full">
        <TabsList className="w-full justify-start">
          <ScrollArea className="w-full whitespace-nowrap rounded-md h-auto">
            <TabsTrigger value="painel">
              <Link to={`${uri}?tab=painel`}>Painel</Link>
            </TabsTrigger>
            <TabsTrigger value="titulo">
              <Link to={`${uri}?tab=titulo`}>Solicitações</Link>
            </TabsTrigger>
            {(checkUserPermission("MASTER") ||
              checkUserDepartments("FINANCEIRO")) && (
              <>
                <TabsTrigger value="cartoes">
                  <Link to={`${uri}?tab=cartoes`}>Cartões</Link>
                </TabsTrigger>
                <TabsTrigger value="vencimentos">
                  <Link to={`${uri}?tab=vencimentos`}>Vencimentos</Link>
                </TabsTrigger>
                <TabsTrigger value="bordero">
                  <Link to={`${uri}?tab=bordero`}>Borderôs</Link>
                </TabsTrigger>
                <TabsTrigger value="movimento-contabil">
                  <Link to={`${uri}?tab=movimento-contabil`}>
                    Movimento Contábil
                  </Link>
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
        <TabsContent value="cartoes">
          <Cartoes />
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
