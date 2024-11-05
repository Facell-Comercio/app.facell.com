import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { CustomCombobox } from "@/components/custom/CustomCombobox";
import SelectEscalonamento from "@/components/custom/SelectEscalonamento";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useConfiguracoes } from "@/hooks/comercial/useConfiguracoes";
import { usePoliticas } from "@/hooks/comercial/usePoliticas";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useStorePoliticas } from "../politicas/store-politicas";
import { useStoreComissionamentoPoliticas } from "../store";

const ModalCargo = () => {
  const [modalOpen, closeModal] =
    useStoreComissionamentoPoliticas((state) => [
      state.modalCargoOpen,
      state.closeModalCargo,
    ]);
  const id_politica = useStorePoliticas().id;
  const [cargo, setCargo] = useState({
    id_cargo: "",
    id_escalonamento: "1",
  });

  const { data } = useConfiguracoes().getCargos();
  const {
    mutate: insertCargoPolitica,
    isSuccess,
  } = usePoliticas().insertCargoPolitica();

  const defaultValuesCargos =
    data?.map((value: any) => ({
      value: value.id,
      label: value.cargo,
    })) || [];
  const cargoName = useMemo(
    () =>
      defaultValuesCargos.filter(
        (curr: any) =>
          curr.value == cargo.id_cargo
      )[0]?.label,
    [cargo.id_cargo]
  );

  function handleClickCancel() {
    closeModal();
  }

  function handleSubmit() {
    if (
      !cargo.id_cargo ||
      !cargo.id_escalonamento
    ) {
      toast({
        title: "Dados insuficientes!",
        variant: "warning",
        duration: 2000,
      });
      return;
    }
    insertCargoPolitica({
      ...cargo,
      id_politica: id_politica || "",
    });
  }

  useEffect(() => {
    isSuccess && handleClickCancel();
  }, [isSuccess]);
  useEffect(() => {
    setCargo({
      id_cargo: "",
      id_escalonamento: "1",
    });
  }, [modalOpen]);

  return (
    <Dialog
      open={modalOpen}
      onOpenChange={handleClickCancel}
    >
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>
            Inclusão de Cargo na Política
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-3">
          <span className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Origem
            </label>
            <CustomCombobox
              className="w-[38ch]"
              value={cargoName}
              onChange={(id) =>
                setCargo({
                  ...cargo,
                  id_cargo: id || "",
                })
              }
              defaultValues={defaultValuesCargos}
              placeholder="Selecione o cargo..."
            />
          </span>
          <SelectEscalonamento
            value={cargo.id_escalonamento}
            label={"Escalonamento"}
            placeholder={
              "Selecione o escalonamento"
            }
            className="min-w-fit"
            onChange={(id) =>
              setCargo({
                ...cargo,
                id_escalonamento: id || "",
              })
            }
          />
        </div>
        <DialogFooter>
          <Button
            variant={"secondary"}
            onClick={handleClickCancel}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCargo;
