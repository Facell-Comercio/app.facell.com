import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { hasPermission } from "@/helpers/checkAuthorization";
import { useConciliacaoCP } from "@/hooks/financeiro/useConciliacaoCP";
import { HandCoins, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { VencimentosConciliarProps } from "../tables/TitulosConciliar";
import { TransacoesConciliarProps } from "../tables/TransacoesConciliar";
import { useStoreTableConciliacaoCP } from "../tables/store-tables";
import FormConciliacaoCP from "./Form";
import { useStoreConciliacaoCP } from "./store";

export type ConciliacaoCPSchemaProps = {
  id_conciliacao?: string;
  transacoes: TransacoesConciliarProps[];
  vencimentos: VencimentosConciliarProps[];
  data_pagamento?: string;
  data_conciliacao?: string;
  responsavel?: string;
  tipo?: string;
  id_conta_bancaria?: string;
};

const ModalConciliarCP = () => {
  const modalOpen = useStoreConciliacaoCP().modalOpen;

  const toggleModal = useStoreConciliacaoCP().toggleModal;
  const closeModal = useStoreConciliacaoCP().closeModal;

  const id_conciliacao = useStoreConciliacaoCP().id_conciliacao;
  const isPending = useStoreConciliacaoCP().isPending;
  const vencimentosSelection = useStoreTableConciliacaoCP().vencimentosSelection;
  const transacoesSelection = useStoreTableConciliacaoCP().transacoesSelection;
  const formRef = useRef(null);
  const isMaster = hasPermission("MASTER");

  const { data, isLoading } = useConciliacaoCP().getOne(id_conciliacao);

  const { mutate: deleteConciliacao, isSuccess: isDeletedConciliacao } =
    useConciliacaoCP().deleteConciliacao();
  const newData: ConciliacaoCPSchemaProps & Record<string, any> = {} as ConciliacaoCPSchemaProps &
    Record<string, any>;

  for (const key in data?.data) {
    if (typeof data?.data[key] === "number") {
      newData[key] = String(data?.data[key]);
    } else if (data?.data[key] === null) {
      newData[key] = "";
    } else {
      newData[key] = data?.data[key];
    }
  }

  if (!id_conciliacao) {
    newData.vencimentos = vencimentosSelection;
    newData.transacoes = transacoesSelection;
  }

  // function handleSelectionConciliacaoCPs(item: ConciliacaoCPProps) {
  //   if (checkedTitulos.length) {
  //     const transferredData = {
  //       new_id: item.id,
  //       titulos: checkedTitulos,
  //     };
  //     transferTitulos(transferredData);
  //     toggleModal();
  //   } else {
  //     toast({
  //       title: "Nenhum título foi selecionado",
  //       duration: 3000,
  //       description:
  //         "Para realizar a tranferência de títulos é necessário selecionar alguns",
  //     });
  //   }
  //   // toggleGetTitulo(false);
  //   toggleModalConciliarCPs();
  // }
  async function excluirConciliacaoCP() {
    deleteConciliacao(id_conciliacao);
  }

  useEffect(() => {
    if (isDeletedConciliacao) {
      closeModal();
    }
  }, [isDeletedConciliacao]);

  return (
    <Dialog open={modalOpen} onOpenChange={toggleModal}>
      <DialogContent className="max-w-[92vw]">
        <DialogHeader>
          <DialogTitle>
            {id_conciliacao ? `Conciliação: ${id_conciliacao}` : "Nova Conciliação"}
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <section className="max-h-[75vh] max-w-full overflow-auto scroll-thin z-50">
          {modalOpen && !isLoading ? (
            <FormConciliacaoCP id={id_conciliacao} data={newData} formRef={formRef} />
          ) : (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )}
        </section>
        <DialogFooter>
          {id_conciliacao ? (
            <AlertPopUp
              title={"Deseja realmente excluir"}
              description="Essa ação não pode ser desfeita. A conciliação será excluída definitivamente do servidor."
              action={() => {
                excluirConciliacaoCP();
              }}
            >
              <Button
                type={"button"}
                size="lg"
                variant={"destructive"}
                className={`text-white ${!isMaster && "hidden"}`}
              >
                <X className="me-2" />
                Desfazer Conciliação
              </Button>
            </AlertPopUp>
          ) : (
            <Button
              type={"submit"}
              size="lg"
              className="dark:text-white"
              disabled={isPending}
              onClick={() => {
                // @ts-ignore "Funciona"
                formRef.current && formRef.current.requestSubmit();
              }}
            >
              <HandCoins className="me-2" />
              {isPending ? "Conciliando..." : "Conciliar"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalConciliarCP;
