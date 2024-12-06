import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import SelectCargo from "@/components/custom/SelectCargo";
import SelectEscalonamento from "@/components/custom/SelectEscalonamento";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { usePoliticas } from "@/hooks/comercial/usePoliticas";
import { useEffect, useState } from "react";
import { useStorePoliticas } from "../politicas/store-politicas";
import { useStoreComissionamentoPoliticas } from "../store";

const ModalCargo = () => {
  const [modalOpen, closeModal] = useStoreComissionamentoPoliticas((state) => [
    state.modalCargoOpen,
    state.closeModalCargo,
  ]);
  const id_politica = useStorePoliticas().id;
  const [cargo, setCargo] = useState({
    id_cargo: "",
    id_escalonamento: "1",
  });

  const { mutate: insertCargoPolitica, isSuccess } = usePoliticas().insertCargoPolitica();

  function handleClickCancel() {
    closeModal();
  }

  function handleSubmit() {
    if (!cargo.id_cargo || !cargo.id_escalonamento) {
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
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>Inclusão de Cargo na Política</DialogTitle>
        </DialogHeader>
        <div className="flex gap-3">
          <SelectCargo
            label="Cargo"
            onChange={(cargo) => setCargo((prev) => ({ ...prev, id_cargo: cargo.id }))}
            value={cargo.id_cargo}
            className="flex-1"
            tipoValue="id"
            tipo_list={["meta", "agregador"]}
          />
          <SelectEscalonamento
            value={cargo.id_escalonamento}
            label={"Escalonamento"}
            placeholder={"Selecione o escalonamento"}
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
          <Button variant={"secondary"} onClick={handleClickCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCargo;
