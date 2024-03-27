import { PenLine, Save } from "lucide-react";
import { FaRegCircleXmark } from "react-icons/fa6";
import { Button } from "../ui/button";

interface ModalButtonsProps{
    id?: string | null
    modalEditing?: boolean
    save?: ()=>void
    cancel?: ()=>void
    edit?: ()=>void
}

const ModalButtons = ({id, modalEditing, save, cancel, edit}:ModalButtonsProps) => {
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
          <Button type="submit" size="lg" variant={"secondary"} onClick={cancel}>
            <FaRegCircleXmark className="me-2 text-xl" />
            Cancelar
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