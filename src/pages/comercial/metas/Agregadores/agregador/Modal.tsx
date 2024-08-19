import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AlertPopUp from "@/components/custom/AlertPopUp";
import ModalButtons from "@/components/custom/ModalButtons";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { checkUserPermission } from "@/helpers/checkAuthorization";
import {
  AgregadoresProps,
  useAgregadores,
} from "@/hooks/comercial/useAgregadores";
import { Trash } from "lucide-react";
import { useEffect, useRef } from "react";
import FormAgregador from "./Form";
import { useStoreAgregador } from "./store-agregador";

const initialPropsAgregador: AgregadoresProps = {
  id: "",
  ref: "",
  ciclo: "",
  id_grupo_economico: "",
  grupo_economico: "",
  id_filial: "",
  filial: "",
  cargo: "",
  tipo_agregacao: "",
  cpf: "",
  nome: "",
  tags: "",

  data_inicial: "",
  data_final: "",

  proporcional: "100",
  metas: [],
};

const ModalAgregador = () => {
  const [modalOpen, closeModal, modalEditing, editModal, isPending, id] =
    useStoreAgregador((state) => [
      state.modalOpen,
      state.closeModal,
      state.modalEditing,
      state.editModal,
      state.isPending,
      state.id,
    ]);

  const formRef = useRef(null);

  const { data, isLoading } = useAgregadores().getOne(id);

  const { mutate: deleteAgregador, isSuccess } =
    useAgregadores().deleteAgregador();
  const newDataAgregador: AgregadoresProps & Record<string, any> =
    {} as AgregadoresProps & Record<string, any>;

  for (const key in data) {
    if (typeof data[key] === "number") {
      newDataAgregador[key] = String(data[key]);
    } else if (data[key] === null) {
      newDataAgregador[key] = "";
    } else {
      newDataAgregador[key] = data[key];
    }
  }

  function handleClickCancel() {
    editModal(false);
    closeModal();
  }

  useEffect(() => {
    if (isSuccess) {
      editModal(false);
      closeModal();
    }
  }, [isSuccess]);

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {id ? `Agregador: ${id}` : "Nova Agregador"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <FormAgregador
              id={id}
              data={id ? newDataAgregador : initialPropsAgregador}
              formRef={formRef}
            />
          ) : (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )}
        </ScrollArea>
        <DialogFooter>
          <ModalButtons
            id={id}
            modalEditing={modalEditing}
            edit={() => editModal(true)}
            cancel={handleClickCancel}
            formRef={formRef}
            isLoading={isPending}
            blockEdit={
              !checkUserPermission(["GERENCIAR_AGREGADORES", "MASTER"])
            }
          >
            <AlertPopUp
              title={"Deseja realmente excluir"}
              description="Essa ação não pode ser desfeita. A agregador será excluída definitivamente do servidor."
              action={() => {
                deleteAgregador(id);
              }}
            >
              <Button
                type={"button"}
                size="lg"
                variant={"destructive"}
                className={`text-white justify-self-start ${
                  !modalEditing && "hidden"
                }`}
              >
                <Trash className="me-2" />
                Excluir Agregador
              </Button>
            </AlertPopUp>
          </ModalButtons>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAgregador;
