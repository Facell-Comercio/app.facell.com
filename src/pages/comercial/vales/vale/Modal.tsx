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
import { useVales, ValeProps } from "@/hooks/comercial/useVales";
import { Trash } from "lucide-react";
import { useEffect, useRef } from "react";
import FormVale from "./Form";
import { useStoreVale } from "./store";

const initialPropsVale: ValeProps = {
  id: "",
  created_at: "",
  updated_at: "",
  data_inicio_cobranca: "",
  cpf_colaborador: "",
  id_filial: "",
  valor: "",
  saldo: "",
  origem: "",
  parcelas: "1",
  parcela: "1",
  obs: "",
  nome_colaborador: "",
  id_criador: "",
  id_colaborador: "",
  filial: "",
  abatimentos: [],
};

const ModalVale = () => {
  const [modalOpen, closeModal, modalEditing, editModal, isPending, id] =
    useStoreVale((state) => [
      state.modalOpen,
      state.closeModal,
      state.modalEditing,
      state.editModal,
      state.isPending,
      state.id,
    ]);

  const formRef = useRef(null);

  const { data, isLoading } = useVales().getOne(id);

  const { mutate: deleteVale, isSuccess } = useVales().deleteVale();
  const newDataVale: ValeProps & Record<string, any> = {} as ValeProps &
    Record<string, any>;

  for (const key in data) {
    if (typeof data[key] === "number") {
      newDataVale[key] = String(data[key]);
    } else if (data[key] === null) {
      newDataVale[key] = "";
    } else {
      newDataVale[key] = data[key];
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
          <DialogTitle>{id ? `Vale: ${id}` : "Novo Vale"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <FormVale
              id={id}
              data={id ? newDataVale : initialPropsVale}
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
            blockEdit={!checkUserPermission(["GERENCIAR_VALES", "MASTER"])}
          >
            <AlertPopUp
              title={"Deseja realmente excluir"}
              description="Essa ação não pode ser desfeita. O vale será excluído definitivamente do servidor."
              action={() => {
                deleteVale(id);
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
                Excluir Vale
              </Button>
            </AlertPopUp>
          </ModalButtons>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalVale;
