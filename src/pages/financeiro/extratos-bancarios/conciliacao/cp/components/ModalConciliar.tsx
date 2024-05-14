import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { checkUserPermission } from "@/helpers/checkAuthorization";
import { useConciliacaoCP } from "@/hooks/financeiro/useConciliacaoCP";
// import { useStoreConciliacaoCP } from "@/pages/financeiro/extratos-bancarios/conciliacao/conciliacaocp/store";
import { HandCoins, X } from "lucide-react";
import { useRef } from "react";
import { TitulosConciliarProps } from "../tables/TitulosConciliar";
import { TransacaoConciliarProps } from "../tables/TransacoesConciliar";
import { useStoreTableConciliacaoCP } from "../tables/store-tables";
import FormConciliacaoCP from "./Form";
import { useStoreConciliacaoCP } from "./store";

export type ConciliacaoCPSchemaProps = {
  id?: string;
  transacoes: TransacaoConciliarProps[];
  titulos: TitulosConciliarProps[];
};

const ModalConciliarCP = () => {
  const modalOpen = useStoreConciliacaoCP().modalOpen;

  const toggleModal = useStoreConciliacaoCP().toggleModal;

  const id = useStoreConciliacaoCP().id;
  const titulosSelection = useStoreTableConciliacaoCP().titulosSelection;
  const transacoesSelection = useStoreTableConciliacaoCP().transacoesSelection;
  const formRef = useRef(null);
  const isMaster = checkUserPermission("MASTER");

  const { data, isLoading } = useConciliacaoCP().getOne(id);

  const { mutate: deleteConciliacaoCP } =
    useConciliacaoCP().deleteConciliacaoCP();
  const newData: ConciliacaoCPSchemaProps & Record<string, any> =
    {} as ConciliacaoCPSchemaProps & Record<string, any>;

  for (const key in data?.data) {
    if (typeof data?.data[key] === "number") {
      newData[key] = String(data?.data[key]);
    } else if (data?.data[key] === null) {
      newData[key] = "";
    } else {
      newData[key] = data?.data[key];
    }
  }

  if (!id) {
    newData.titulos = titulosSelection;
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

  function excluirConciliacaoCP() {
    deleteConciliacaoCP({ id, titulos: data?.data.titulos });
    toggleModal();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={toggleModal}>
      <DialogContent className="max-w-[92vw]">
        <DialogHeader>
          <DialogTitle>
            {id ? `Conciliação: ${id}` : "Nova Conciliação"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] max-w-full">
          {modalOpen && !isLoading ? (
            <FormConciliacaoCP id={id} data={newData} formRef={formRef} />
          ) : (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )}
        </ScrollArea>
        <DialogFooter>
          {id ? (
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
              onClick={() => {
                // @ts-ignore "Funciona"
                formRef.current && formRef.current.requestSubmit();
              }}
            >
              <HandCoins className="me-2" />
              Conciliar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalConciliarCP;
