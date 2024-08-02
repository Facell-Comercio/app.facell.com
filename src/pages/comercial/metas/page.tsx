import fetchApi from '@/api/fetchApi';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  checkUserDepartments,
  checkUserPermission,
} from '@/helpers/checkAuthorization';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

const ContasPagarPage = () => {
  const queryClient = useQueryClient();

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || '';
  console.log({activeTab});

  
  queryClient.prefetchQuery({
    queryKey: ['financeiro', 'forma_pagamento', 'lista'],
    queryFn: async () => await fetchApi.financeiro.forma_pagamento.getAll(),
  });

  queryClient.prefetchQuery({
    queryKey: ['financeiro', 'contas_pagar', 'cartao', 'lista', null],
    staleTime: Infinity,
    queryFn: async () =>
      await fetchApi.financeiro.contas_pagar.cartoes.getAll({}),
  });

  return (
    <div className="flex p-4">
      <Tabs defaultValue={activeTab || 'painel'} className="w-full">
        <TabsList className="w-full justify-start">
          <ScrollArea className="w-full whitespace-nowrap rounded-md h-auto">
            <TabsTrigger value="painel">Painel</TabsTrigger>
            <TabsTrigger value="titulo">Solicitações</TabsTrigger>
            {(checkUserPermission('MASTER') ||
              checkUserDepartments('FINANCEIRO')) && (
              <>
                <TabsTrigger value="cartoes">Cartões</TabsTrigger>
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

        </TabsContent>
        <TabsContent value="titulo">

        </TabsContent>
        <TabsContent value="cartoes">

        </TabsContent>
        <TabsContent value="vencimentos">

        </TabsContent>
        <TabsContent value="bordero">

        </TabsContent>
        <TabsContent value="movimento-contabil">

        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContasPagarPage;
