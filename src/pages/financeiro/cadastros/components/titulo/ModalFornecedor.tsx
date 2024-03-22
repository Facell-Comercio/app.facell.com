import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";
import { Button } from "@/components/ui/button";
import { PenLine, Save } from "lucide-react";
import { FaRegCircleXmark } from "react-icons/fa6";
import { GrCircleAlert } from "react-icons/gr";

import { useState } from "react";
import FormFornecedor from "./FormFornecedor";
import { useStoreFornecedor } from "./store-fornecedor";
const ModalFornecedor = () => {
  const [isModalEditing, setIsModalEditing] = useState(false)
  const modalFornecedorIsOpen = useStoreFornecedor().modalFornecedorIsOpen
  const id_titulo = useStoreFornecedor().id_titulo
  const setModalFornecedorIsOpen = useStoreFornecedor().setModalFornecedorIsOpen

  function handleClickSave(){
    setIsModalEditing(false);
    setModalFornecedorIsOpen({ open: false, id_titulo: "" });
  }
  function handleClickCancel(){
    setIsModalEditing(false);
    setModalFornecedorIsOpen({ open: false, id_titulo: "" });
  }
  function handleClickInative(){
    setIsModalEditing(false);
    setModalFornecedorIsOpen({ open: false, id_titulo: "" });
  }
  

  return (
    <Dialog open={modalFornecedorIsOpen} onOpenChange={() => setModalFornecedorIsOpen({ open: false, id_titulo: "" })}>
      <DialogContent className="min-w-[80vw] sm:w-full p-2 sm:p-5 h-[95vh] overflow-hidden backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>{id_titulo ? `Titulo: ${id_titulo}` : "Novo titulo"}</DialogTitle>
        </DialogHeader>

        <FormFornecedor id_titulo={id_titulo} />
        <DialogFooter>
          {!id_titulo && (<>
            <Button type="submit" size="lg" variant={"secondary"} onClick={handleClickCancel}>
              <FaRegCircleXmark className="me-2 text-xl" />
              Cancelar
            </Button>
            <Button type="submit" size="lg"  onClick={handleClickSave}><Save className="me-2"/>Salvar</Button>
          </>)}
          {id_titulo && isModalEditing && (<>
            
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
          </>)}
          {id_titulo && !isModalEditing && (<>
          <Button type="submit" size="lg" variant={"destructive"} onClick={handleClickInative}>
            <GrCircleAlert className="me-2 text-xl" />
            
            Inativar
          </Button>
          <Button type="submit" size="lg" onClick={()=>setIsModalEditing(true)}>
            <PenLine className="me-2" />
            Editar
          </Button>
          </>)}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalFornecedor;
