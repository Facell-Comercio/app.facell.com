import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FormTituloPagar from "./form-titulo";
import { useStoreTitulo } from "./store-titulo";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

type TModalTituloPagar = {
  id_titulo: number | null,
  open: boolean,
  onOpenChange: ()=>void,
}

const ModalTituloPagar = ({id_titulo, open, onOpenChange}:TModalTituloPagar) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full lg:w-[80vw] xl:max-w-[80vw] p-2 sm:p-5 h-screen overflow-hidden backdrop-blur-sm">
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
