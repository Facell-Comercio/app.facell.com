import {
  Dialog,
  DialogContent,
  DialogDescription,
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

import { normalizeDate } from "@/helpers/mask";
import { ContestacaoEspelhosProps, useEspelhos } from "@/hooks/comercial/useEspelhos";
import {
  CircleCheck,
  CircleX,
  Eye,
  MessageSquareMore,
  MessageSquareText,
  Pencil,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useStoreEspelho } from "./store";

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
  const [
    modalOpen,
    closeModal,
    isPending,
    editIsPending,
    modalEditing,
    editModal,
    id,
    id_comissao,
  ] = useStoreEspelho((state) => [
    state.modalContestacaoOpen,
    state.closeModalContestacao,
    state.isPending,
    state.editIsPending,
    state.modalContestacaoEditing,
    state.editModalContestacao,
    state.id_contestacao,
    state.id,
  ]);

  const user = useAuthStore().user;

  const { data, isLoading } = useEspelhos().getOneContestacao(id);
  const {
    mutate: insertOneContestacao,
    isPending: insertOneContestacaoIsPending,
    isSuccess: insertOneContestacaoIsSuccess,
    isError: insertOneContestacaoIsError,
  } = useEspelhos().insertOneContestacao();
  const {
    mutate: updateStatusContestacao,
    isPending: updateStatusContestacaoIsPending,
    isSuccess: updateStatusContestacaoIsSuccess,
    isError: updateStatusContestacaoIsError,
  } = useEspelhos().updateStatusContestacao();
  const {
    mutate: deleteContestacao,
    // isPending: deleteContestacaoIsPending,
    // isSuccess: deleteContestacaoIsSuccess,
    // isError: deleteContestacaoIsError,
  } = useEspelhos().deleteContestacao();
  const [formData, setFormData] = useState<ContestacaoEspelhosProps>(
    id ? data : { ...initialContestacao, user: user?.nome, id_comissao }
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
      setFormData({
        ...initialContestacao,
        user: user?.nome,
        id_comissao: id_comissao || "",
      });
    } else if (modalOpen && id) {
      setFormData(data);
    }
  }, [modalOpen, isLoading]);

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{`Contestação: ${id}`}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
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
            <section className="flex flex-col gap-2 bg-slate-200 dark:bg-blue-950 p-2 rounded-md">
              <span className="flex items-center">
                <MessageSquareMore className="me-2" size={20} />
                <h3 className="font-semibold text-md">Contestação</h3>
              </span>
              <div className="flex gap-3 flex-wrap">
                <InputWithLabel
                  label="Usuário:"
                  value={formData?.user || ""}
                  readOnly
                  className="flex-1"
                  disabled={!modalEditing}
                />
                <InputWithLabel
                  label="Data:"
                  value={normalizeDate(formData?.created_at || new Date()) || ""}
                  readOnly
                  className="flex-1"
                  disabled={!modalEditing}
                />
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-medium">Contestação</label>
                  <Textarea
                    value={formData?.contestacao || ""}
                    readOnly={!!id}
                    disabled={!modalEditing}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, contestacao: e.target.value }))
                    }
                  />
                </div>
              </div>
            </section>

            {id && (
              <section className="flex flex-col gap-2 bg-slate-200 dark:bg-blue-950 p-2 rounded-md">
                <span className="flex items-center">
                  <MessageSquareText className="me-2" size={20} />
                  <h3 className="font-semibold text-md">Resposta</h3>
                </span>

                <div className="flex gap-2 flex-wrap">
                  <InputWithLabel
                    label="Usuário:"
                    value={formData?.user_resposta || user?.nome || ""}
                    readOnly
                    className="flex-1"
                    disabled={!modalEditing}
                  />
                  <InputWithLabel
                    label="Data:"
                    value={normalizeDate(formData?.data_resposta || new Date()) || ""}
                    readOnly
                    className="flex-1"
                    disabled={!modalEditing}
                  />
                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-sm font-medium">Resposta:</label>
                    <Textarea
                      value={formData?.resposta || ""}
                      disabled={!modalEditing}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, resposta: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </section>
            )}
          </section>
        </ScrollArea>
        <DialogFooter>
          {modalEditing ? (
            <div className={`flex justify-end gap-2 w-full`}>
              {id ? (
                <>
                  {/* <AlertPopUp
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
                  </AlertPopUp> */}
                  <div className="flex gap-2">
                    <AlertPopUp
                      title={"Deseja realmente marcar como ciente"}
                      description="Essa ação não pode ser desfeita. Essa contestação será definitivamente definida como ciente do servidor."
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
                        <Button variant={"destructive"} disabled={isPending || !formData?.resposta}>
                          {/* <CircleAlert className="me-2" size={18} /> */}
                          <Eye className="me-2" size={18} />
                          Ciente
                        </Button>
                      </span>
                    </AlertPopUp>
                    <AlertPopUp
                      title={"Deseja realmente marcar como improcedente"}
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
                </>
              ) : (
                <Button onClick={handleSubmit}>
                  <Save className="me-2" />
                  Salvar
                </Button>
              )}
            </div>
          ) : (
            <Button onClick={() => editModal(true)} variant={"warning"}>
              <Pencil className="me-2" />
              Editar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalContestacao;
