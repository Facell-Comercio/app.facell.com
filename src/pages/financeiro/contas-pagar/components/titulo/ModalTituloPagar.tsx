import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FormTituloPagar from "./FormTituloPagar";
// import { useStoreTitulo } from "./store-titulo";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useStoreTitulo } from "./store-titulo";

const ModalTituloPagar = () => {
  const modalTituloOpen = useStoreTitulo().modalTituloOpen
  const id_titulo = useStoreTitulo().id_titulo
  const setModalTituloOpen = useStoreTitulo().setModalTituloOpen

  return (
    <Dialog open={modalTituloOpen} onOpenChange={() => setModalTituloOpen({ open: false, id_titulo: "" })}>
      <DialogContent className="min-w-[80vw] sm:w-full p-2 sm:p-5 h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{id_titulo ? `Titulo: ${id_titulo}` : "Novo titulo"}</DialogTitle>
        </DialogHeader>

        <FormTituloPagar id_titulo={id_titulo} />
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
