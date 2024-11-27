import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";

import { InputWithLabel } from "@/components/custom/FormInput";
import ModalButtons from "@/components/custom/ModalButtons";
import { useAuthStore } from "@/context/auth-store";
import { ItemEspelhosProps, useEspelhos } from "@/hooks/comercial/useEspelhos";
import { Percent } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TbCurrencyReal } from "react-icons/tb";
import { useStoreEspelho } from "./store";

const initialItem = {
  segmento: "",
  descricao: "",
  meta: "0",
  realizado: "0",
  atingimento: "0",
  valor: "0",
};

const ModalItem = () => {
  const [
    modalOpen,
    closeModal,
    isPending,
    editIsPending,
    modalEditing,
    editModal,
    id,
    id_comissao,
    type,
  ] = useStoreEspelho((state) => [
    state.modalItemOpen,
    state.closeModalItem,
    state.isPending,
    state.editIsPending,
    state.modalItemEditing,
    state.editModalItem,
    state.id_item,
    state.id,
    state.type,
  ]);

  const user = useAuthStore().user;

  const { data, isLoading } = useEspelhos().getOneItem(id);
  const {
    mutate: insertOneItem,
    isPending: insertOneItemIsPending,
    isSuccess: insertOneItemIsSuccess,
    isError: insertOneItemIsError,
  } = useEspelhos().insertOneItem();
  const {
    mutate: updateItem,
    isPending: updateItemIsPending,
    isSuccess: updateItemIsSuccess,
    isError: updateItemIsError,
  } = useEspelhos().updateItem();

  const formRef = useRef(null);

  const [formData, setFormData] = useState<ItemEspelhosProps>(
    id ? data : { ...initialItem, user: user?.nome, tipo: type, id_comissao }
  );

  function handleClickCancel() {
    closeModal();
  }
  function handleSubmit() {
    if (!id) insertOneItem({ ...formData });
    if (id) updateItem(formData);
  }

  useEffect(() => {
    if (insertOneItemIsSuccess) {
      closeModal();
      editIsPending(false);
    } else if (insertOneItemIsError) {
      editIsPending(false);
    } else if (insertOneItemIsPending) {
      editIsPending(true);
    }
  }, [insertOneItemIsPending]);

  useEffect(() => {
    if (updateItemIsSuccess) {
      closeModal();
      editIsPending(false);
    } else if (updateItemIsError) {
      editIsPending(false);
    } else if (updateItemIsPending) {
      editIsPending(true);
    }
  }, [updateItemIsPending]);

  useEffect(() => {
    if (!modalOpen) {
      setFormData({
        ...initialItem,
        tipo: type || "",
        id_comissao: id_comissao || "",
      });
    } else if (modalOpen && id) {
      setFormData(data);
    } else {
      setFormData({
        ...initialItem,
        tipo: type || "",
        id_comissao: id_comissao || "",
      });
    }
  }, [modalOpen, isLoading]);

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="capitalize">
            {id ? `${type}: ${id}` : `Inclusão de ${type === "comissao" ? "comissão" : "bônus"}:`}
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex gap-3 flex-col p-1"
          >
            <InputWithLabel
              label="Segmento:"
              value={formData?.segmento || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, segmento: e.target.value }))}
              className="flex-1"
              inputClass="uppercase"
              disabled={!modalEditing}
              required
            />
            <InputWithLabel
              label="Descrição:"
              value={formData?.descricao || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))}
              className="flex-1"
              inputClass="uppercase"
              disabled={!modalEditing}
              required
            />
            <div className="flex gap-3 flex-wrap">
              <InputWithLabel
                label="Meta:"
                value={formData?.meta || "-"}
                onChange={(e) => setFormData((prev) => ({ ...prev, meta: e.target.value }))}
                className="flex-[1_1_calc(50%-0.75rem)] min-w-[20ch]"
                disabled={!modalEditing}
                type="number"
                step="0.01"
                icon={TbCurrencyReal}
                iconLeft
                iconClass="bg-secondary"
              />
              <InputWithLabel
                label="Realizado:"
                value={formData?.realizado || "-"}
                onChange={(e) => setFormData((prev) => ({ ...prev, realizado: e.target.value }))}
                className="flex-[1_1_calc(50%-0.75rem)] min-w-[20ch]"
                disabled={!modalEditing}
                type="number"
                step="0.01"
                icon={TbCurrencyReal}
                iconLeft
                iconClass="bg-secondary"
              />
              <InputWithLabel
                label="Atingimento:"
                value={formData?.atingimento || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, atingimento: e.target.value }))}
                className="flex-[1_1_calc(50%-0.75rem)] min-w-[20ch]"
                disabled={!modalEditing}
                type="number"
                step="0.01"
                // max={100}
                min={0}
                icon={Percent}
                iconClass="bg-secondary"
              />
              <InputWithLabel
                label="Valor:"
                value={formData?.valor || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, valor: e.target.value }))}
                className="flex-[1_1_calc(50%-0.75rem)] min-w-[20ch]"
                disabled={!modalEditing}
                type="number"
                step="0.01"
                icon={TbCurrencyReal}
                iconLeft
                iconClass="bg-secondary"
              />
            </div>
          </form>
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

export default ModalItem;
