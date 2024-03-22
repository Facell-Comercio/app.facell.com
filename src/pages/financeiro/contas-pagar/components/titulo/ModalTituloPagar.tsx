import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FormTituloPagar from "./FormTituloPagar";
// import { useStoreTitulo } from "./store-titulo";
import { useStoreTitulo } from "./store-titulo";

const ModalTituloPagar = () => {
  const modalTituloOpen = useStoreTitulo().modalTituloOpen
  const id_titulo = useStoreTitulo().id_titulo
  const closeModalTitulo = useStoreTitulo().closeModalTitulo
  const handleClose = ()=>{
    closeModalTitulo()
  }

  return (
    <Dialog open={modalTituloOpen} onOpenChange={handleClose}>
      <DialogContent className="min-w-[80vw] sm:w-full p-2 sm:p-5 h-[95vh] overflow-hidden backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>{id_titulo ? `Titulo: ${id_titulo}` : "Novo titulo"}</DialogTitle>
        </DialogHeader>

        {modalTituloOpen && <FormTituloPagar id_titulo={id_titulo} />}
      </DialogContent>
    </Dialog>
  );
};

export default ModalTituloPagar;
