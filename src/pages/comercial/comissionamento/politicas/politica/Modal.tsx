import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { Input } from "@/components/custom/FormInput";
import SelectMes from "@/components/custom/SelectMes";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { usePoliticas } from "@/hooks/comercial/usePoliticas";
import { Ban, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { useStorePoliticas } from "../politicas/store-politicas";
import { useStorePolitica } from "./store";

const initialFormData = {
  descricao: "",
  month: String(new Date().getMonth() + 2),
  year: String(new Date().getFullYear()),
};

const ModalPolitica = () => {
  const [formData, setFormData] = useState(
    initialFormData
  );
  const {
    data: resultInsertOne,
    mutate: insertOne,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
    isError: insertIsError,
  } = usePoliticas().insertOne();
  const {
    data: resultCopy,
    mutate: copyPolitica,
    isPending: copyIsPending,
    isSuccess: copyIsSuccess,
    isError: copyIsError,
  } = usePoliticas().copyPolitica();

  const [
    action,
    modalOpen,
    closeModal,
    editIsPending,
    isPending,
  ] = useStorePolitica((state) => [
    state.action,
    state.modalOpen,
    state.closeModal,
    state.editIsPending,
    state.isPending,
  ]);

  const [current_id, setIdPolitica] =
    useStorePoliticas((state) => [
      state.id,
      state.setIdPolitica,
    ]);

  const onSubmitData = () => {
    if (!formData.descricao) {
      toast({
        title: "Informe a descricao!",
        variant: "warning",
      });
      return;
    }
    if (action === "insert") {
      setIdPolitica(null);
      insertOne(formData);
    }
    if (action === "copy") {
      copyPolitica({
        ...formData,
        current_id: current_id || "",
      });
    }
  };

  useEffect(() => {
    if (insertIsSuccess) {
      closeModal();
      setIdPolitica(
        resultInsertOne.new_id_politica
      );
      editIsPending(false);
    } else if (insertIsError) {
      editIsPending(false);
    } else if (insertIsPending) {
      editIsPending(true);
    }
  }, [insertIsPending]);

  useEffect(() => {
    if (copyIsSuccess) {
      closeModal();
      setIdPolitica(resultCopy.new_id_politica);
      editIsPending(false);
    } else if (copyIsError) {
      editIsPending(false);
    } else if (copyIsPending) {
      editIsPending(true);
    }
  }, [copyIsPending]);

  function handleClickCancel() {
    closeModal();
  }

  useEffect(() => {
    !modalOpen && setFormData(initialFormData);
  }, [modalOpen]);

  return (
    <Dialog
      open={modalOpen}
      onOpenChange={handleClickCancel}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {action === "copy"
              ? "Copiar Política"
              : "Nova Política"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          <span className="flex flex-1 gap-2 flex-col">
            <label className="text-sm font-medium">
              Mês de Referência
            </label>
            <SelectMes
              value={formData.month}
              onValueChange={(month) =>
                setFormData((prev) => ({
                  ...prev,
                  month,
                }))
              }
            />
          </span>
          <span className="flex flex-1 gap-2 flex-col">
            <label className="text-sm font-medium">
              Ano de Referência
            </label>
            <Input
              value={formData.year}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  year: e.target.value,
                }))
              }
              type="number"
              min={2023}
            />
          </span>
        </div>
        <div className="flex gap-2 flex-col">
          <label className="text-sm font-medium">
            Descrição
          </label>
          <Textarea
            value={formData.descricao}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                descricao: e.target.value,
              }))
            }
            placeholder="Descreva sobre as alterações que serão realizadas nessa nova política..."
          />
        </div>
        <DialogFooter>
          <Button
            variant={"secondary"}
            size={"lg"}
            onClick={handleClickCancel}
            disabled={isPending}
          >
            <Ban className="me-2 text-xl" />
            Cancelar
          </Button>
          <AlertPopUp
            title={`Deseja realmente ${
              action === "copy"
                ? "copiar essa política?"
                : "incluir essa política?"
            }`}
            description="Essa ação não pode ser desfeita. A política com os dados fornecidos será definitivamento incluida no servidor."
            action={onSubmitData}
          >
            <Button
              size={"lg"}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <FaSpinner
                    size={18}
                    className="me-2 animate-spin"
                  />
                  Salvando
                </>
              ) : (
                <>
                  <Save className="me-2" />
                  Salvar
                </>
              )}
            </Button>
          </AlertPopUp>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalPolitica;
