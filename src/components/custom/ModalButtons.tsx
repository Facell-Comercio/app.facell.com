import { PenLine, Save } from "lucide-react";
import { FaRegCircleXmark } from "react-icons/fa6";
import { Button } from "../ui/button";

interface ModalButtonsProps{
    id?: string | null
    modalEditing?: boolean
    cancel: ()=>void
    edit?: ()=>void
    formRef: React.MutableRefObject<HTMLFormElement | null>
}

const ModalButtons = ({id, modalEditing, cancel, edit, formRef}:ModalButtonsProps) => {
  return ( 
        <>
            {!id && (
          <div className="flex gap-2 items-end flex-wrap">
            <Button type={"button"} size="lg" variant={"secondary"} onClick={cancel}>
              <FaRegCircleXmark className="me-2 text-xl" />
              Cancelar
            </Button>
            <Button type={"button"} size="lg" className="dark:text-white" onClick={() => formRef.current && formRef.current.requestSubmit()}>
              <Save className="me-2"/>
              Salvar
            </Button>
          </div>)
          }
          {id && modalEditing && (
          <div className="flex gap-2 items-end flex-wrap">
          <Button type={"button"} size="lg" variant={"secondary"} onClick={cancel}>
            <FaRegCircleXmark className="me-2 text-xl"/>
              Cancelar
            </Button>
            <Button type={"button"} size="lg" className="dark:text-white" onClick={() => formRef.current && formRef.current.requestSubmit()}>
              <Save className="me-2" />
              Salvar
            </Button>
          </div>)
          }
          {id && !modalEditing && (
          <div className="flex gap-2 items-end flex-wrap">
          <Button type={"button"} size="lg" className="bg-orange-400 hover:bg-orange-500 dark:bg-orange-700 dark:hover:bg-orange-600 dark:text-white" onClick={edit}>
            <PenLine className="me-2" />
            Editar
          </Button>
          </div>)
          }
        </>
     );
}
 
export default ModalButtons;