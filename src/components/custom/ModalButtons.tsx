import { Ban, PenLine, Save } from "lucide-react";
import { ReactNode } from "react";
import { FaSpinner } from "react-icons/fa6";
import { Button } from "../ui/button";

interface ModalButtonsProps {
  id?: number | string | null;
  modalEditing?: boolean;
  cancel?: () => void;
  edit?: () => void;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
  children?: ReactNode;
  blockEdit?: boolean;
  blockCancel?: boolean;
  isLoading?: boolean;
}

const ModalButtons = ({
  id,
  modalEditing,
  cancel,
  edit,
  formRef,
  children: Children,
  blockEdit,
  blockCancel,
  isLoading,
}: ModalButtonsProps) => {
  return (
    <div className="flex flex-row-reverse w-full justify-between">
      {!id && (
        <div className="flex gap-2 items-end justify-self-end	flex-wrap">
          {isLoading ? (
            <Button
              type={"submit"}
              size="lg"
              className="dark:text-white"
              disabled
              onClick={() => {
                formRef.current && formRef.current.requestSubmit();
              }}
            >
              <FaSpinner size={18} className="me-2 animate-spin" />
              Salvando...
            </Button>
          ) : (
            <Button
              type={"submit"}
              size="lg"
              className="dark:text-white"
              onClick={() => {
                formRef.current && formRef.current.requestSubmit();
              }}
            >
              <Save className="me-2" />
              Salvar
            </Button>
          )}
        </div>
      )}
      {id && modalEditing && edit && (
        <div className="flex flex-col sm:flex-row gap-2 items-end justify-self-end	flex-wrap">
          {!blockCancel && (
            <Button
              type={"button"}
              size="lg"
              variant={"secondary"}
              disabled={isLoading}
              onClick={cancel}
            >
              <Ban className="me-2 text-xl" />
              Cancelar
            </Button>
          )}
          {isLoading ? (
            <Button
              type={"submit"}
              size="lg"
              className="dark:text-white"
              disabled
              onClick={() => {
                formRef.current && formRef.current.requestSubmit();
              }}
            >
              <FaSpinner size={18} className="me-2 animate-spin" />
              Salvando...
            </Button>
          ) : (
            <Button
              type={"submit"}
              size="lg"
              className="dark:text-white"
              onClick={() => {
                formRef.current && formRef.current.requestSubmit();
              }}
            >
              <Save className="me-2" />
              Salvar
            </Button>
          )}
        </div>
      )}
      {id && !modalEditing && !blockEdit && edit && (
        <div className="flex flex-col sm:flex-row gap-2 items-end justify-self-end	flex-wrap">
          <Button
            type={"button"}
            size="lg"
            variant={"warning"}
            className="text-white"
            onClick={edit}
          >
            <PenLine className="me-2" />
            Editar
          </Button>
        </div>
      )}
      {id && !modalEditing && !edit && (
        <div className="flex flex-col sm:flex-row gap-2 items-end justify-self-end	flex-wrap">
          {!blockCancel && (
            <Button
              type={"button"}
              size="lg"
              variant={"secondary"}
              disabled={isLoading}
              onClick={cancel}
            >
              <Ban className="me-2 text-xl" />
              Cancelar
            </Button>
          )}
          {isLoading ? (
            <Button
              type={"submit"}
              size="lg"
              className="dark:text-white"
              disabled
              onClick={() => {
                formRef.current && formRef.current.requestSubmit();
              }}
            >
              <FaSpinner size={18} className="me-2 animate-spin" />
              Salvando...
            </Button>
          ) : (
            <Button
              type={"submit"}
              size="lg"
              className="dark:text-white"
              onClick={() => {
                formRef.current && formRef.current.requestSubmit();
              }}
            >
              <Save className="me-2" />
              Salvar
            </Button>
          )}
        </div>
      )}
      {id && Children}
    </div>
  );
};

export default ModalButtons;
