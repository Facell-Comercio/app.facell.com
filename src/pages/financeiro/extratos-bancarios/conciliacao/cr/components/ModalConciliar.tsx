import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { checkUserPermission } from "@/helpers/checkAuthorization";
import { useConciliacaoCR } from "@/hooks/financeiro/useConciliacaoCR";
import { HandCoins, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { RecebimentosConciliarProps } from "../tables/RecebimentosConciliar";
import { TransacoesConciliarProps } from "../tables/TransacoesConciliar";
import { useStoreTableConciliacaoCR } from "../tables/store-tables";
import FormConciliacaoCR from "./Form";
import { useStoreConciliacaoCR } from "./store";

export type ConciliacaoCRSchemaProps = {
  id_conciliacao?: string;
  transacoes: TransacoesConciliarProps[];
  recebimentos: RecebimentosConciliarProps[];
  data_recebimento?: string;
  data_conciliacao?: string;
  responsavel?: string;
  tipo?: string;
  id_conta_bancaria?: string;
};

const ModalConciliarCP = () => {
  const modalOpen = useStoreConciliacaoCR().modalOpen;

  const toggleModal = useStoreConciliacaoCR().toggleModal;
  const closeModal = useStoreConciliacaoCR().closeModal;

  const id_conciliacao = useStoreConciliacaoCR().id_conciliacao;
  const isPending = useStoreConciliacaoCR().isPending;
  const recebimentosSelection = useStoreTableConciliacaoCR().recebimentosSelection;
  const transacoesSelection = useStoreTableConciliacaoCR().transacoesSelection;
  const formRef = useRef(null);
  const isMaster = checkUserPermission("MASTER");

  const { data, isLoading } = useConciliacaoCR().getOne(id_conciliacao);

  const { mutate: deleteConciliacao, isSuccess: isDeletedConciliacao } =
    useConciliacaoCR().deleteConciliacao();
  const newData: ConciliacaoCRSchemaProps & Record<string, any> = {} as ConciliacaoCRSchemaProps &
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
    newData.recebimentos = recebimentosSelection;
    newData.transacoes = transacoesSelection;
  }

  // function handleSelectionConciliacaoCRs(item: ConciliacaoCRProps) {
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
  async function excluirConciliacaoCR() {
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
        </DialogHeader>
        <section className="max-h-[75vh] max-w-full overflow-auto scroll-thin z-50">
          {modalOpen && !isLoading ? (
            <FormConciliacaoCR id={id_conciliacao} data={newData} formRef={formRef} />
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
                excluirConciliacaoCR();
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
