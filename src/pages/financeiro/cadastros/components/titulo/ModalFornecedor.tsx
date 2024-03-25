import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";
import { Button } from "@/components/ui/button";
import { PenLine, Save } from "lucide-react";
import { FaRegCircleXmark } from "react-icons/fa6";
import { GrCircleAlert } from "react-icons/gr";

import FormFornecedor from "./FormFornecedor";
import { useStoreFornecedor } from "./store-fornecedor";
const ModalFornecedor = () => {
  const modalFornecedorIsOpen = useStoreFornecedor().modalFornecedorIsOpen
  const modalFornecedorIsEditing = useStoreFornecedor().modalFornecedorIsEditing
  const setModalFornecedorIsEditing = useStoreFornecedor().setModalFornecedorIsEditing
  const id = useStoreFornecedor().id
  const setModalFornecedorIsOpen = useStoreFornecedor().setModalFornecedorIsOpen

  function handleClickSave(){
    setModalFornecedorIsEditing({ open: false, id: "" });
    setModalFornecedorIsOpen({ open: false, id: "" });
  }
  function handleClickCancel(){
    setModalFornecedorIsEditing({ open: false, id: "" });
    setModalFornecedorIsOpen({ open: false, id: "" });
  }
  function handleClickInative(){
    setModalFornecedorIsEditing({ open: false, id: "" });
    setModalFornecedorIsOpen({ open: false, id: "" });
  }
  

  return (
    <Dialog open={modalFornecedorIsOpen} onOpenChange={() => setModalFornecedorIsOpen({ open: false, id: "" })}>
      <DialogContent className="min-w-[80vw] sm:w-full p-2 sm:p-5 h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{id ? `Titulo: ${id}` : "Novo titulo"}</DialogTitle>
        </DialogHeader>

        <FormFornecedor id={id}/>
        <DialogFooter>
          {!id && (<>
            <Button type="submit" size="lg" variant={"secondary"} onClick={handleClickCancel}>
              <FaRegCircleXmark className="me-2 text-xl" />
              Cancelar
            </Button>
            <Button type="submit" size="lg"  onClick={handleClickSave}><Save className="me-2"/>Salvar</Button>
          </>)
          }
          {id && modalFornecedorIsEditing && (<>
            
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
          </>)
          }
          {id && !modalFornecedorIsEditing && (<>
          <Button type="submit" size="lg" variant={"destructive"} onClick={handleClickInative}>
            <GrCircleAlert className="me-2 text-xl" />
            Inativar
          </Button>
          <Button type="submit" size="lg" onClick={()=>setModalFornecedorIsEditing({ open: true, id })}>
            <PenLine className="me-2" />
            Editar
          </Button>
          </>)
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalFornecedor;
