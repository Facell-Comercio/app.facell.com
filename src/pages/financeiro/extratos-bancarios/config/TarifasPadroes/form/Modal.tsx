import AlertPopUp from "@/components/custom/AlertPopUp";
import { Input } from "@/components/custom/FormInput";
import ModalButtons from "@/components/custom/ModalButtons";
import SelectGrupoEconomico from "@/components/custom/SelectGrupoEconomico";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { TarifaProps, useTarifas } from "@/hooks/financeiro/useTarifas";
import ModalCentrosCustos from "@/pages/financeiro/components/ModalCentrosCustos";
import ModalPlanosContas, {
  ItemPlanoContas,
} from "@/pages/financeiro/components/ModalPlanosContas";
import { CentroCustos } from "@/types/financeiro/centro-custos-type";
import { Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useStoreTableTarifas } from "../table/store-table";

const ModalTarifas = () => {
  const [id, modalOpen, closeModal, modalEditing, editModal] =
    useStoreTableTarifas((state) => [
      state.id,
      state.modalOpen,
      state.closeModal,
      state.modalEditing,
      state.editModal,
    ]);

  const [openModalCentrosCusto, setOpenModalCentrosCusto] =
    useState<boolean>(false);
  const [openModalPlanoContas, setOpenModalPlanoContas] =
    useState<boolean>(false);
  const formRef = useRef(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const { data, isSuccess } = useTarifas().getOne(id);
  const newData: TarifaProps = data?.data;

  const {
    mutate: insert,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
  } = useTarifas().insertOne();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
  } = useTarifas().update();
  const { mutate: deleteOne } = useTarifas().deleteOne();

  const initialPropsData = {
    id_grupo_economico: "",
    id_centro_custo: "",
    id_plano_contas: "",
    descricao: "",
    centro_custo: undefined,
    plano_contas: undefined,
  };
  const [formData, setFormData] = useState<TarifaProps>(initialPropsData);

  useEffect(() => {
    if (isSuccess || modalOpen || data) {
      setFormData({
        ...newData,
      });
      if (descriptionRef.current) {
        descriptionRef.current.value = newData?.descricao || "";
      }
    }
  }, [isSuccess, modalOpen, descriptionRef.current, data]);

  function handleSubmit() {
    if (
      !formData.id_grupo_economico ||
      !formData.id_centro_custo ||
      !formData.id_plano_contas ||
      !formData.descricao
    ) {
      toast({
        title: "Dados insuficientes",
        description: "Todos os campos do formulário são obrigatórios",
        variant: "warning",
      });
      return;
    }
    !id && insert({ id, ...formData });
    id && update(formData);
  }
  function handleClickCancel() {
    closeModal();
  }
  const handleSelectCentroCusto = (centro_custo: CentroCustos) => {
    setFormData((prev) => ({
      ...prev,
      id_centro_custo: centro_custo.id,
      centro_custo: centro_custo.nome,
    }));
  };
  function handleSelectionPlanoContas(plano_contas: ItemPlanoContas) {
    setFormData((prev) => ({
      ...prev,
      id_plano_contas: plano_contas.id,
      plano_contas: plano_contas.descricao,
    }));
  }

  useEffect(() => {
    if (!modalOpen) {
      setFormData(initialPropsData);
    }
  }, [modalOpen]);

  useEffect(() => {
    if (insertIsSuccess || updateIsSuccess) {
      closeModal();
    }
  }, [insertIsSuccess, updateIsSuccess]);

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{id ? `Tarifa: ${id}` : "Nova Tarifa"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] w-full">
          {!id || isSuccess ? (
            <form
              action=""
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="flex gap-3 flex-col"
            >
              <section className="flex w-full gap-3">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-sm">
                    Grupo Econômico
                  </label>
                  <SelectGrupoEconomico
                    className="flex-1 min-w-44 sm:min-w-96"
                    value={formData.id_grupo_economico}
                    disabled={!modalEditing}
                    onChange={(id_grupo_economico) => {
                      setFormData((prev) => ({
                        ...prev,
                        id_grupo_economico: id_grupo_economico || "",
                      }));
                      modalEditing &&
                        setFormData((prev) => ({
                          ...prev,
                          id_centro_custo: "",
                          id_plano_contas: "",
                          centro_custo: "",
                          plano_contas: "",
                        }));
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-semibold text-sm">Descrição</label>
                  <Input
                    type="text"
                    ref={descriptionRef}
                    disabled={!modalEditing}
                    required
                    onBlur={() => {
                      setFormData((prev) => ({
                        ...prev,
                        descricao:
                          (descriptionRef.current &&
                            descriptionRef.current.value) ||
                          "",
                      }));
                    }}
                  />
                </div>
              </section>
              <section className="flex w-full gap-3">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-semibold text-sm">
                    Centro de Custo
                  </label>
                  <Input
                    title={
                      !formData.id_grupo_economico
                        ? "Primeiro selecione o grupo econômico"
                        : ""
                    }
                    value={formData.centro_custo || ""}
                    placeholder="SELECIONE O CENTRO DE CUSTO"
                    onClick={() => setOpenModalCentrosCusto(true)}
                    readOnly
                    disabled={!formData.id_grupo_economico || !modalEditing}
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-semibold text-sm">
                    Plano de Contas
                  </label>
                  <Input
                    title={
                      !formData.id_grupo_economico
                        ? "Primeiro selecione o grupo econômico"
                        : ""
                    }
                    required
                    value={formData.plano_contas || ""}
                    placeholder="SELECIONE O PLANO DE CONTAS"
                    onClick={() => setOpenModalPlanoContas(true)}
                    readOnly
                    disabled={!formData.id_grupo_economico || !modalEditing}
                  />
                </div>
              </section>
            </form>
          ) : (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )}
        </ScrollArea>
        <ModalCentrosCustos
          handleSelection={handleSelectCentroCusto}
          id_grupo_economico={formData.id_grupo_economico}
          // @ts-expect-error 'Ignore, vai funcionar...'
          onOpenChange={setOpenModalCentrosCusto}
          open={openModalCentrosCusto}
          closeOnSelection
        />
        <ModalPlanosContas
          open={openModalPlanoContas && !!formData.id_grupo_economico}
          id_grupo_economico={formData.id_grupo_economico}
          tipo="Despesa"
          //@ts-ignore
          onOpenChange={() => setOpenModalPlanoContas(false)}
          handleSelection={handleSelectionPlanoContas}
          closeOnSelection
        />
        <DialogFooter>
          <ModalButtons
            id={id}
            modalEditing={modalEditing}
            edit={() => editModal(true)}
            cancel={handleClickCancel}
            formRef={formRef}
            isLoading={insertIsPending || updateIsPending}
          >
            {id && (
              <AlertPopUp
                title={"Deseja realmente excluir"}
                description="Essa ação não pode ser desfeita. A tarifa será excluída definitivamente do servidor."
                action={() => {
                  deleteOne(id);
                  closeModal();
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
                  Excluir
                </Button>
              </AlertPopUp>
            )}
          </ModalButtons>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalTarifas;
