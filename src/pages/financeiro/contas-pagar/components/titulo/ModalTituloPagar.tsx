import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FormTituloPagar from "./FormTituloPagar";
import { useStoreTitulo } from "./store-titulo";

const ModalTituloPagar = () => {
  const modalOpen = useStoreTitulo().modalOpen
  const closeModal = useStoreTitulo().closeModal
  // const modalEditing = useStoreTitulo().modalEditing
  const editModal = useStoreTitulo().editModal
  const id = useStoreTitulo().id

  function handleClickCancel(){
    editModal(false);
    closeModal();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent className="min-w-[80vw] sm:w-full p-2 sm:p-5 h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{id ? `Titulo: ${id}` : "Novo titulo"}</DialogTitle>
        </DialogHeader>

        {modalOpen && <FormTituloPagar id={id} />}
      </DialogContent>
    </Dialog>
  );
};

export default ModalTituloPagar;
