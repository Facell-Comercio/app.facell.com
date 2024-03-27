import { PenLine, Save } from "lucide-react";
import { FaRegCircleXmark } from "react-icons/fa6";
import { GrCircleAlert } from "react-icons/gr";
import { Button } from "../ui/button";

interface ModalButtonsProps{
    id?: string | null
    modalEditing?: boolean
    save?: ()=>void
    cancel?: ()=>void
    inative?: ()=>void
    edit?: ()=>void
}

const ModalButtons = ({id, modalEditing, save, cancel, inative, edit}:ModalButtonsProps) => {
    return ( 
        <>
            {!id && (
          <div className="flex gap-2 items-end flex-wrap">
            <Button type="submit" size="lg" variant={"secondary"} onClick={cancel}>
              <FaRegCircleXmark className="me-2 text-xl" />
              Cancelar
            </Button>
            <Button type="submit" size="lg"  onClick={save}><Save className="me-2"/>Salvar</Button>
          </div>)
          }
          {id && modalEditing && (
          <div className="flex gap-2 items-end flex-wrap">
            
          <Button type="submit" size="lg" variant={"destructive"} onClick={inative}>
            <GrCircleAlert className="me-2"/>
            Inativar
          </Button>

          <Button type="submit" size="lg" variant={"secondary"} onClick={cancel}>
              <FaRegCircleXmark className="me-2 text-xl"/>
              Cancelar
            </Button>

          <Button type="submit" size="lg" onClick={save}>
            <Save className="me-2" />
            Salvar
          </Button>
          </div>)
          }
          {id && !modalEditing && (
          <div className="flex gap-2 items-end flex-wrap">
          <Button type="submit" size="lg" variant={"destructive"} onClick={inative}>
            <GrCircleAlert className="me-2 text-xl" />
            Inativar
          </Button>
          <Button type="submit" size="lg" onClick={edit}>
            <PenLine className="me-2" />
            Editar
          </Button>
          </div>)
          }
        </>
     );
}
 
export default ModalButtons;