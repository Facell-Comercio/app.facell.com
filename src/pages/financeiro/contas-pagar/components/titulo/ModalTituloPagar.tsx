import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save } from "lucide-react";
import FormTituloPagar from "./FormTituloPagar";
import { useStoreTitulo } from "./store-titulo";

const ModalTituloPagar = () => {
  const modalOpen = useStoreTitulo().modalOpen;
  const closeModal = useStoreTitulo().closeModal;
  // const modalEditing = useStoreTitulo().modalEditing
  const editModal = useStoreTitulo().editModal;
  const id = useStoreTitulo().id;

  function handleClickCancel() {
    editModal(false);
    closeModal();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? `Titulo: ${id}` : "Novo titulo"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="min-h-[70vh]">
          {modalOpen && <FormTituloPagar id={id} />}
        </ScrollArea>
        <DialogFooter>
          <Button type="submit" size="lg">
            <Save className="me-2" />
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalTituloPagar;
