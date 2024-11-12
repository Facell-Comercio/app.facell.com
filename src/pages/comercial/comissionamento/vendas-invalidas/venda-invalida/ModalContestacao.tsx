import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { InputWithLabel } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/context/auth-store";
import {
  ContestacaoVendasInvalidadasProps,
  useVendasInvalidadas,
} from "@/hooks/comercial/useVendasInvalidadas";
import { CircleCheck, CircleX, Eye, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useStoreVendaInvalidada } from "./store";

function colorStatus(status: string) {
  if (status === "procedente") return "bg-green-500";
  else if (status === "improcedente" || status === "ciente") return "bg-red-500";
  else return "bg-secondary";
}

const initialContestacao = {
  contestacao: "",
  resposta: "",
  status: "em_analise",
};

const ModalContestacao = () => {
  const [modalOpen, closeModal, isPending, editIsPending, id, id_venda] = useStoreVendaInvalidada(
    (state) => [
      state.modalContestacaoOpen,
      state.closeModalContestacao,
      state.isPending,
      state.editIsPending,
      state.id_contestacao,
      state.id,
    ]
  );

  const user = useAuthStore().user;

  const { data, isLoading } = useVendasInvalidadas().getOneContestacao(id);
  const {
    mutate: insertOneContestacao,
    isPending: insertOneContestacaoIsPending,
    isSuccess: insertOneContestacaoIsSuccess,
    isError: insertOneContestacaoIsError,
  } = useVendasInvalidadas().insertOneContestacao();
  const {
    mutate: updateStatusContestacao,
    isPending: updateStatusContestacaoIsPending,
    isSuccess: updateStatusContestacaoIsSuccess,
    isError: updateStatusContestacaoIsError,
  } = useVendasInvalidadas().updateStatusContestacao();
  const {
    mutate: deleteContestacao,
    isPending: deleteContestacaoIsPending,
    isSuccess: deleteContestacaoIsSuccess,
    isError: deleteContestacaoIsError,
  } = useVendasInvalidadas().deleteContestacao();
  const [formData, setFormData] = useState<ContestacaoVendasInvalidadasProps>(
    id ? data : { ...initialContestacao, user: user?.nome, id_venda }
  );

  function handleClickCancel() {
    closeModal();
  }
  function handleSubmit() {
    if (!id) {
      insertOneContestacao({ ...formData });
    }
  }

  useEffect(() => {
    if (insertOneContestacaoIsSuccess) {
      closeModal();
      editIsPending(false);
    } else if (insertOneContestacaoIsError) {
      editIsPending(false);
    } else if (insertOneContestacaoIsPending) {
      editIsPending(true);
    }
  }, [insertOneContestacaoIsPending]);

  useEffect(() => {
    if (updateStatusContestacaoIsSuccess) {
      closeModal();
      editIsPending(false);
    } else if (updateStatusContestacaoIsError) {
      editIsPending(false);
    } else if (updateStatusContestacaoIsPending) {
      editIsPending(true);
    }
  }, [updateStatusContestacaoIsPending]);

  useEffect(() => {
    if (!modalOpen) {
      setFormData({ ...initialContestacao, user: user?.nome, id_venda: id_venda || "" });
    } else if (modalOpen && id) {
      setFormData(data);
    }
  }, [modalOpen, isLoading]);

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{`Contestação: ${id}`}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <section className="flex gap-3 flex-col">
            <span
              className={`uppercase text-center rounded-md p-1 text-sm font-semibold ${colorStatus(
                formData?.status || ""
              )}`}
            >
              {formData?.status && formData?.status.replaceAll("_", " ")}
            </span>
            <InputWithLabel label="Usuário da Contestação:" value={formData?.user || ""} readOnly />
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Contestação</label>
              <Textarea
                value={formData?.contestacao || ""}
                readOnly={!!id}
                onChange={(e) => setFormData((prev) => ({ ...prev, contestacao: e.target.value }))}
              />
            </div>
            {id && (
              <>
                <InputWithLabel
                  label="Usuário da Resposta:"
                  value={formData?.user_resposta || user?.nome || ""}
                  readOnly
                />
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Resposta:</label>
                  <Textarea
                    value={formData?.resposta || ""}
                    readOnly={formData?.status !== "em_analise"}
                    onChange={(e) => setFormData((prev) => ({ ...prev, resposta: e.target.value }))}
                  />
                </div>
              </>
            )}
          </section>
        </ScrollArea>
        <DialogFooter>
          <div className="flex justify-between gap-2 w-full">
            <AlertPopUp
              title={"Deseja realmente excluir"}
              description="Essa ação não pode ser desfeita. Essa contestação será definitivamente removidas do servidor."
              action={() => {
                deleteContestacao(id);
                closeModal();
              }}
            >
              <Button variant={"destructive"} disabled={isPending}>
                <Trash2 className="me-2" size={18} /> Excluir
              </Button>
            </AlertPopUp>
            {id ? (
              formData?.status === "em_analise" && (
                <div className="flex gap-2">
                  <AlertPopUp
                    title={"Deseja realmente marcar como procedente"}
                    description="Essa ação não pode ser desfeita. Essa contestação será definitivamente definida como improcedente do servidor."
                    action={() =>
                      updateStatusContestacao({
                        id: id || "",
                        status: "ciente",
                        resposta: formData?.resposta,
                      })
                    }
                  >
                    <span
                      title={
                        !formData?.resposta ? "Primeiro defina a resposta para a contestação" : ""
                      }
                    >
                      <Button variant={"warning"} disabled={isPending || !formData?.resposta}>
                        {/* <CircleAlert className="me-2" size={18} /> */}
                        <Eye className="me-2" size={18} />
                        Ciente
                      </Button>
                    </span>
                  </AlertPopUp>
                  <AlertPopUp
                    title={"Deseja realmente marcar como procedente"}
                    description="Essa ação não pode ser desfeita. Essa contestação será definitivamente definida como improcedente do servidor."
                    action={() =>
                      updateStatusContestacao({
                        id: id || "",
                        status: "improcedente",
                        resposta: formData?.resposta,
                      })
                    }
                  >
                    <span
                      title={
                        !formData?.resposta ? "Primeiro defina a resposta para a contestação" : ""
                      }
                    >
                      <Button variant={"destructive"} disabled={isPending || !formData?.resposta}>
                        <CircleX className="me-2" size={18} /> Improcedente
                      </Button>
                    </span>
                  </AlertPopUp>
                  <AlertPopUp
                    title={"Deseja realmente marcar como procedente"}
                    description="Essa ação não pode ser desfeita. Essa contestação será definitivamente definida como procedente do servidor."
                    action={() =>
                      updateStatusContestacao({
                        id: id || "",
                        status: "procedente",
                        resposta: formData?.resposta,
                      })
                    }
                  >
                    <span
                      title={
                        !formData?.resposta ? "Primeiro defina a resposta para a contestação" : ""
                      }
                    >
                      <Button variant={"success"} disabled={isPending || !formData?.resposta}>
                        <CircleCheck className="me-2" size={18} /> Procedente
                      </Button>
                    </span>
                  </AlertPopUp>
                </div>
              )
            ) : (
              <Button onClick={handleSubmit}>
                <Save className="me-2" />
                Salvar
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalContestacao;
