import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";
import { Button } from "@/components/ui/button";
import { PenLine, Save } from "lucide-react";
import { FaRegCircleXmark } from "react-icons/fa6";
import { GrCircleAlert } from "react-icons/gr";

import FormFornecedor from "./FormFornecedor";
import { useStoreFornecedor } from "./store-fornecedor";
const ModalFornecedor = () => {
  const modalOpen = useStoreFornecedor().modalOpen
  const closeModal = useStoreFornecedor().closeModal
  const modalEditing = useStoreFornecedor().modalEditing
  const editModal = useStoreFornecedor().editModal
  const id = useStoreFornecedor().id

  function handleClickSave(){
    editModal(false);
    closeModal();
  }
  function handleClickCancel(){
    editModal(false);
    closeModal();
  }
  function handleClickInative(){
    editModal(false);
    closeModal();
  }
  

  return (
    <Dialog open={modalOpen} onOpenChange={() => closeModal()}>
      <DialogContent className="min-w-[80vw] sm:w-[95vw] p-2 sm:p-5 h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{id ? `Fornecedor: ${id}` : "Novo fornecedor"}</DialogTitle>
        </DialogHeader>

        <FormFornecedor id={id}/>
        <DialogFooter>
          <>
          
          {!id && (
          <div className="flex gap-2 justify-end flex-wrap">
            <Button type="submit" size="lg" variant={"secondary"} onClick={handleClickCancel}>
              <FaRegCircleXmark className="me-2 text-xl" />
              Cancelar
            </Button>
            <Button type="submit" size="lg"  onClick={handleClickSave}><Save className="me-2"/>Salvar</Button>
          </div>)
          }
          {id && modalEditing && (
          <div className="flex gap-2 justify-end flex-wrap">
            
          <Button type="submit" size="lg" variant={"destructive"} onClick={handleClickInative}>
            <GrCircleAlert className="me-2"/>
            Inativar
          </Button>

          <Button type="submit" size="lg" variant={"secondary"} onClick={handleClickCancel}>
              <FaRegCircleXmark className="me-2 text-xl"/>
              Cancelar
            </Button>

          <Button type="submit" size="lg" onClick={handleClickSave}>
            <Save className="me-2" />
            Salvar
          </Button>
          </div>)
          }
          {id && !modalEditing && (
          <div className="flex gap-2 justify-end flex-wrap">
          <Button type="submit" size="lg" variant={"destructive"} onClick={handleClickInative}>
            <GrCircleAlert className="me-2 text-xl" />
            Inativar
          </Button>
          <Button type="submit" size="lg" onClick={()=>editModal(true)}>
            <PenLine className="me-2" />
            Editar
          </Button>
          </div>)
          }
          </>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalFornecedor;
