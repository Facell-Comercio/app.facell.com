import { Button } from "@/components/ui/button";
// import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { InputWithLabel } from "@/components/custom/FormInput";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useVales } from "@/hooks/comercial/useVales";
import { Ban, HandCoins, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import ModalUsersPermissaoAbonar, {
  UserPermisaoAbonar,
} from "../../components/ModalUsersPermissaoAbonar";
import { useStoreTableVale } from "../table/store-table";

const initialFormData = {
  abonador: "",
  id_abonador: "",
  motivo: "",
  email_abonador: "",
};

const ModalVale = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
  const [modalUsersPermissaoAbonarOpen, setModalUsersPermissaoAbonarOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const { mutate: abonoLote, isPending, isSuccess } = useVales().abonoLote();
  const [idSelection, resetRowSelection] = useStoreTableVale((state) => [
    state.idSelection,
    state.resetRowSelection,
  ]);
  function handleModalUsersPermissaoAbonar(item: UserPermisaoAbonar) {
    setFormData((prev) => ({
      ...prev,
      id_abonador: item.id,
      abonador: item.nome,
      email_abonador: item.email,
    }));
  }

  function handleSubmit() {
    if (!formData.abonador) {
      toast({
        title: "Dados insuficientes!",
        description: "Preencha o abonador",
        variant: "warning",
      });
      return;
    }
    if (!formData.motivo) {
      toast({
        title: "Dados insuficientes!",
        description: "Preencha o motivo",
        variant: "warning",
      });
      return;
    }
    if (formData.motivo.length < 10) {
      toast({
        title: "Motivo inválido!",
        description: "O motivo deve ter no mínimo 10 caracteres",
        variant: "warning",
      });
      return;
    }
    abonoLote({ ...formData, id_vales_list: idSelection });
  }

  function handleCloseModal() {
    setFormData(initialFormData);
    handleClose();
    resetRowSelection();
  }
  useEffect(() => {
    if (isSuccess) {
      handleCloseModal();
    }
  }, [isSuccess]);

  return (
    <Dialog open={open} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Abono de Vales</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <section className="flex flex-col gap-3 p-1">
            <InputWithLabel
              label="Abonador:"
              value={formData.abonador}
              onClick={() => setModalUsersPermissaoAbonarOpen(true)}
              readOnly
              disabled={isPending}
            />
            <span className="flex gap-2 flex-col">
              <label className="text-sm font-medium">Motivo:</label>
              <Textarea
                value={formData.motivo}
                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                minLength={10}
                className="uppercase"
                disabled={isPending}
              />
            </span>
          </section>
        </ScrollArea>
        <DialogFooter>
          <Button variant={"secondary"} onClick={handleCloseModal} disabled={isPending}>
            <Ban size={18} className="me-2" /> Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <FaSpinner size={18} className="me-2 animate-spin" /> Salvando...
              </>
            ) : (
              <>
                <Save size={18} className="me-2" /> Salvar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
      <ModalUsersPermissaoAbonar
        open={modalUsersPermissaoAbonarOpen}
        onOpenChange={() => setModalUsersPermissaoAbonarOpen(false)}
        handleSelection={handleModalUsersPermissaoAbonar}
      />
    </Dialog>
  );
};

const ButtonAbonar = () => {
  const [modaAbonoOpen, setModaAbonoOpen] = useState(false);
  const idSelection = useStoreTableVale().idSelection;

  return (
    <span title={idSelection.length < 1 ? "Selecione um vale para abonar" : ""}>
      <Button
        variant={"outline"}
        className="border-warning"
        disabled={idSelection.length < 1}
        onClick={() => setModaAbonoOpen(true)}
      >
        <HandCoins className="me-2" size={18} /> Abonar
      </Button>

      <ModalVale open={modaAbonoOpen} handleClose={() => setModaAbonoOpen(false)} />
    </span>
  );
};

export default ButtonAbonar;
