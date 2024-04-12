import { Ban, PenLine, Save } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "../ui/button";

interface ModalButtonsProps {
  id?: string | null;
  modalEditing?: boolean;
  cancel: () => void;
  edit?: () => void;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
  children?: ReactNode;
}

const ModalButtons = ({
  id,
  modalEditing,
  cancel,
  edit,
  formRef,
  children: Children,
}: ModalButtonsProps) => {
  return (
    <div className="flex flex-row-reverse w-full justify-between">
      {!id && (
        <div className="flex gap-2 items-end justify-self-end	flex-wrap">
          <Button
            type={"submit"}
            size="lg"
            className="dark:text-white"
            onClick={() => {
              formRef.current && formRef.current.requestSubmit();
              cancel();
            }}
          >
            <Save className="me-2" />
            Salvar
          </Button>
        </div>
      )}
      {id && modalEditing && edit && (
        <div className="flex gap-2 items-end justify-self-end	flex-wrap">
          <Button
            type={"button"}
            size="lg"
            variant={"secondary"}
            onClick={cancel}
          >
            <Ban className="me-2 text-xl" />
            Cancelar
          </Button>
          <Button
            type={"button"}
            size="lg"
            className="dark:text-white"
            onClick={() => {
              formRef.current && formRef.current.requestSubmit();
              cancel();
            }}
          >
            <Save className="me-2" />
            Salvar
          </Button>
        </div>
      )}
      {id && !modalEditing && edit && (
        <div className="flex gap-2 items-end justify-self-end	flex-wrap">
          <Button
            type={"button"}
            size="lg"
            className="bg-orange-400 hover:bg-orange-500 dark:bg-orange-700 dark:hover:bg-orange-600 dark:text-white"
            onClick={edit}
          >
            <PenLine className="me-2" />
            Editar
          </Button>
        </div>
      )}
      {id && !modalEditing && !edit && (
        <div className="flex gap-2 items-end justify-self-end	flex-wrap">
          <Button
            type={"button"}
            size="lg"
            variant={"secondary"}
            onClick={cancel}
          >
            <Ban className="me-2 text-xl" />
            Cancelar
          </Button>
          <Button
            type={"button"}
            size="lg"
            className="dark:text-white"
            onClick={() => {
              formRef.current && formRef.current.requestSubmit();
              cancel();
            }}
          >
            <Save className="me-2" />
            Salvar
          </Button>
        </div>
      )}
      {id && Children}
    </div>
  );
};

export default ModalButtons;
