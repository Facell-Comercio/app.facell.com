import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ModalButtons from "@/components/custom/ModalButtons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useContasBancarias } from "@/hooks/financeiro/useContasBancarias";
import { useRef } from "react";
import FormContaBancaria from "./Form";
import { useStoreContaBancaria } from "./store";

export type ContaBancariaSchema = {
  id: string;
  active: boolean;
  caixa: boolean;
  id_filial: string;
  id_tipo_conta: string;
  id_banco: string;
  banco: string;
  agencia: string;
  dv_agencia: string;
  conta: string;
  descricao: string;
  dv_conta: string;
};

const initialPropsContaBancaria: ContaBancariaSchema = {
  id: "",
  active: true,
  caixa: false,
  id_filial: "",
  id_tipo_conta: "",
  id_banco: "",
  banco: "",
  agencia: "",
  dv_agencia: "",
  conta: "",
  descricao: "",
  dv_conta: "",
};

const ModalContaBancaria = () => {
  const [modalOpen, closeModal, modalEditing, editModal, isPending, id] = useStoreContaBancaria(
    (state) => [
      state.modalOpen,
      state.closeModal,
      state.modalEditing,
      state.editModal,
      state.isPending,
      state.id,
    ]
  );
  const formRef = useRef(null);

  const { data, isLoading } = useContasBancarias().getOne(id);
  const newData: ContaBancariaSchema & Record<string, any> = {} as ContaBancariaSchema &
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

  function handleClickCancel() {
    editModal(false);
    closeModal();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? `Conta Bancária: ${id}` : "Nova Conta Bancária"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <FormContaBancaria
              id={id}
              data={newData.id ? newData : initialPropsContaBancaria}
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
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalContaBancaria;
