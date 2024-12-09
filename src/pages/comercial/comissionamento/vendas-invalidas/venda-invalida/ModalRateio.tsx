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
import { useAuthStore } from "@/context/auth-store";

import {
  RateioVendasInvalidadasProps,
  useVendasInvalidadas,
} from "@/hooks/comercial/useVendasInvalidadas";
import ModalMetasAgregadores, {
  MetasAgregadoresProps,
} from "@/pages/comercial/components/ModalMetasAgregadores";
import { Ban, Pencil, Percent, Save, Trash2 } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { TbCurrencyReal } from "react-icons/tb";
import { useStoreVendaInvalidada } from "./store";

const initialRateio = {
  cpf_colaborador: "",
  nome_colaborador: "",
  cargo_colaborador: "",
  valor: "0",
  percentual: "0",
  canEdit: 1,
};

const ModalRateio = () => {
  const [
    modalOpen,
    closeModal,
    isPending,
    editIsPending,
    modalEditing,
    editModal,
    id,
    id_venda_invalida,
    valor_total_rateio,
    filial,
    ref,
  ] = useStoreVendaInvalidada((state) => [
    state.modalRateioOpen,
    state.closeModalRateio,
    state.isPending,
    state.editIsPending,
    state.modalRateioEditing,
    state.editModalRateio,
    state.id_rateio,
    state.id,
    state.valor_total_rateio,
    state.filial,
    state.ref,
  ]);

  const user = useAuthStore().user;
  const [modalMetasAgregadoresOpen, setModalMetasAgregadoresOpen] = useState(false);

  const { data, isLoading } = useVendasInvalidadas().getOneRateio(id);
  const {
    mutate: insertOneRateio,
    isPending: insertOneRateioIsPending,
    isSuccess: insertOneRateioIsSuccess,
    isError: insertOneRateioIsError,
  } = useVendasInvalidadas().insertOneRateio();
  const {
    mutate: updateRateio,
    isPending: updateRateioIsPending,
    isSuccess: updateRateioIsSuccess,
    isError: updateRateioIsError,
  } = useVendasInvalidadas().updateRateio();
  const {
    mutate: deleteRateio,
    // isPending: deleteRateioIsPending,
    // isSuccess: deleteRateioIsSuccess,
    // isError: deleteRateioIsError,
  } = useVendasInvalidadas().deleteRateio();
  const [formData, setFormData] = useState<RateioVendasInvalidadasProps>(
    id ? data : { ...initialRateio, user: user?.nome, id_venda_invalida }
  );

  function handleClickCancel() {
    closeModal();
  }
  function handleSubmit() {
    if (!id) insertOneRateio(formData);
    if (id) updateRateio(formData);
  }

  const handleChangeValor = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value || "0";
    const percent = ((parseFloat(val) / parseFloat(valor_total_rateio)) * 100).toFixed(6);
    setFormData((prev) => ({ ...prev, valor: val, percentual: percent }));
  };
  const handleChangePercentual = (e: ChangeEvent<HTMLInputElement>) => {
    const percent = e.target.value || "0";
    const novoValor = ((parseFloat(percent) / 100) * parseFloat(valor_total_rateio)).toFixed(6);
    setFormData((prev) => ({ ...prev, percentual: percent, valor: novoValor }));
  };

  useEffect(() => {
    if (insertOneRateioIsSuccess) {
      closeModal();
      editIsPending(false);
    } else if (insertOneRateioIsError) {
      editIsPending(false);
    } else if (insertOneRateioIsPending) {
      editIsPending(true);
    }
  }, [insertOneRateioIsPending]);

  useEffect(() => {
    if (updateRateioIsSuccess) {
      closeModal();
      editIsPending(false);
    } else if (updateRateioIsError) {
      editIsPending(false);
    } else if (updateRateioIsPending) {
      editIsPending(true);
    }
  }, [updateRateioIsPending]);

  useEffect(() => {
    if (!modalOpen) {
      setFormData({
        ...initialRateio,
        id_venda_invalida: id_venda_invalida || "",
      });
    } else if (modalOpen && id) {
      setFormData(data);
    }
  }, [modalOpen, isLoading]);

  function handleSelectionMetaAgregador(colaborador: MetasAgregadoresProps) {
    setFormData((prev) => ({
      ...prev,
      cpf_colaborador: colaborador.cpf,
      nome_colaborador: colaborador.nome,
      cargo_colaborador: colaborador.cargo,
    }));
  }

  const canEdit = !!formData?.canEdit || 0;

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{`Rateio: ${id}`}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <section className="flex gap-3 flex-col p-1">
            <span className="flex gap-2 w-full">
              <InputWithLabel
                label="Nome Colaborador:"
                value={formData?.nome_colaborador || ""}
                readOnly
                className="flex-1"
                onClick={() => canEdit && setModalMetasAgregadoresOpen(true)}
                disabled={!modalEditing}
              />
              <InputWithLabel
                label="CPF Colaborador:"
                value={formData?.cpf_colaborador || ""}
                readOnly
                className="flex-1"
                onClick={() => canEdit && setModalMetasAgregadoresOpen(true)}
                disabled={!modalEditing}
              />
            </span>
            <InputWithLabel
              label="Cargo Colaborador:"
              readOnly
              value={formData?.cargo_colaborador || ""}
              onClick={() => canEdit && setModalMetasAgregadoresOpen(true)}
              disabled={!modalEditing}
            />
            <span className="flex gap-2 w-full">
              <InputWithLabel
                label="Valor:"
                value={formData?.valor || ""}
                onChange={handleChangeValor}
                className="flex-1"
                iconClass="bg-secondary"
                icon={TbCurrencyReal}
                min={0.0001}
                max={parseFloat(valor_total_rateio)}
                step={"0.0001"}
                type="number"
                iconLeft
                disabled={!modalEditing}
                readOnly={!canEdit}
              />
              <InputWithLabel
                label="Percentual:"
                value={formData?.percentual || ""}
                onChange={handleChangePercentual}
                className="flex-1"
                iconClass="bg-secondary"
                step={"0.0001"}
                min={0.0001}
                max={100}
                icon={Percent}
                type="number"
                disabled={!modalEditing}
                readOnly={!canEdit}
              />
            </span>
          </section>
        </ScrollArea>
        {!!canEdit && (
          <DialogFooter>
            {modalEditing ? (
              <div className={`flex ${id ? "justify-between" : "justify-end"} gap-2 w-full`}>
                {id && (
                  <AlertPopUp
                    title={"Deseja realmente excluir"}
                    description="Essa ação não pode ser desfeita. Essa contestação será definitivamente removidas do servidor."
                    action={() => {
                      deleteRateio(id);
                      closeModal();
                    }}
                  >
                    <Button variant={"destructive"} disabled={isPending}>
                      <Trash2 className="me-2" size={18} /> Excluir
                    </Button>
                  </AlertPopUp>
                )}

                <span className="flex gap-2">
                  <Button onClick={handleClickCancel} variant={"secondary"}>
                    <Ban className="me-2" size={18} />
                    Cancelar
                  </Button>
                  <Button onClick={handleSubmit}>
                    <Save className="me-2" size={18} />
                    Salvar
                  </Button>
                </span>
              </div>
            ) : (
              <Button onClick={() => editModal(true)} variant={"warning"}>
                <Pencil className="me-2" size={18} />
                Editar
              </Button>
            )}
          </DialogFooter>
        )}
        <ModalMetasAgregadores
          open={modalMetasAgregadoresOpen}
          onOpenChange={setModalMetasAgregadoresOpen}
          closeOnSelection
          handleSelection={handleSelectionMetaAgregador}
          initialFilters={{
            filial,
            ref,
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ModalRateio;
