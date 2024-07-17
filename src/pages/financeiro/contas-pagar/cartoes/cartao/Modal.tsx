import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AlertPopUp from "@/components/custom/AlertPopUp";
import ModalButtons from "@/components/custom/ModalButtons";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { CartaoSchema, useCartoes } from "@/hooks/financeiro/useCartoes";
import { Trash } from "lucide-react";
import { useRef } from "react";
import FormCartao from "./Form";
import { useStoreCartao } from "./store";

const initialPropsCartao: CartaoSchema = {
  id: "",
  id_matriz: "",
  descricao: "",
  nome_portador: "",
  dia_vencimento: "",
  id_fornecedor: "",
  nome_fornecedor: "",
  active: true,
  faturas: undefined,
  users: undefined,
};

const ModalCartao = () => {
  const [
    modalOpen,
    closeModal,
    modalEditing,
    editModal,
    isPending,
    id,
    paginationFaturas,
  ] = useStoreCartao((state) => [
    state.modalOpen,
    state.closeModal,
    state.modalEditing,
    state.editModal,
    state.isPending,
    state.id,
    state.paginationFaturas,
  ]);

  const formRef = useRef(null);

  const { data, isLoading } = useCartoes().getOne({
    id,
    pagination: paginationFaturas,
  });

  const { mutate: deleteCartao } = useCartoes().deleteCartao();
  const newDataCartao: CartaoSchema & Record<string, any> = {} as CartaoSchema &
    Record<string, any>;

  for (const key in data?.data) {
    if (typeof data?.data[key] === "number") {
      newDataCartao[key] = String(data?.data[key]);
    } else if (data?.data[key] === null) {
      newDataCartao[key] = "";
    } else {
      newDataCartao[key] = data?.data[key];
    }
  }

  function handleClickCancel() {
    editModal(false);
    closeModal();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? `Cartão: ${id}` : "Novo Cartão"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <FormCartao
              id={id}
              data={newDataCartao.id ? newDataCartao : initialPropsCartao}
              formRef={formRef}
            />
          ) : (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )}
        </ScrollArea>
        <DialogFooter>
          <ModalButtons
            id={id}
            modalEditing={modalEditing}
            edit={() => editModal(true)}
            cancel={handleClickCancel}
            formRef={formRef}
            isLoading={isPending}
          >
            <AlertPopUp
              title={"Deseja realmente excluir"}
              description="Essa ação não pode ser desfeita. O cartão será excluído definitivamente do servidor."
              action={() => {
                deleteCartao(id);
              }}
            >
              <Button
                type={"button"}
                size="lg"
                variant={"destructive"}
                className={`text-white justify-self-start ${
                  !modalEditing && "hidden"
                }`}
              >
                <Trash className="me-2" />
                Excluir Cartão
              </Button>
            </AlertPopUp>
          </ModalButtons>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCartao;
