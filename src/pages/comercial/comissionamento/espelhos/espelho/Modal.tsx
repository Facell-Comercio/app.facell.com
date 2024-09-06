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

import {
  EspelhosProps,
  useEspelhos,
} from "@/hooks/comercial/useEspelhos";
import { Trash } from "lucide-react";
import { useEffect, useRef } from "react";
import FormEspelho from "./Form";
import { useStoreEspelho } from "./store";

const initialPropsEspelho: EspelhosProps = {
  id: "",
  ref: "",
  ciclo: "",
  id_grupo_economico: "",
  grupo_economico: "",
  id_filial: "",
  filial: "",
  cargo: "",
  cpf: "",
  nome: "",
  tags: "",

  data_inicial: "",
  data_final: "",

  proporcional: "100",

  controle: "0",
  pos: "0",
  upgrade: "0",
  receita: "0",
  qtde_aparelho: "0",
  aparelho: "0",
  acessorio: "0",
  pitzi: "0",
  fixo: "0",
  wttx: "0",
  live: "0",
};

const ModalEspelho = () => {
  const [
    modalOpen,
    closeModal,
    modalEditing,
    editModal,
    isPending,
    id,
  ] = useStoreEspelho((state) => [
    state.modalOpen,
    state.closeModal,
    state.modalEditing,
    state.editModal,
    state.isPending,
    state.id,
  ]);

  const formRef = useRef(null);

  const { data, isLoading } =
    useEspelhos().getOne(id);

  const { mutate: deleteEspelho, isSuccess } =
    useEspelhos().deleteEspelho();
  const newDataEspelho: EspelhosProps &
    Record<string, any> = {} as EspelhosProps &
    Record<string, any>;

  for (const key in data) {
    if (typeof data[key] === "number") {
      newDataEspelho[key] = String(data[key]);
    } else if (data[key] === null) {
      newDataEspelho[key] = "";
    } else {
      newDataEspelho[key] = data[key];
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
    <Dialog
      open={modalOpen}
      onOpenChange={handleClickCancel}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {id
              ? `Espelho: ${id}`
              : "Novo Espelho"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <FormEspelho
              id={id}
              data={
                id
                  ? newDataEspelho
                  : initialPropsEspelho
              }
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
          >
            <AlertPopUp
              title={"Deseja realmente excluir"}
              description="Essa ação não pode ser desfeita. A espelho será excluída definitivamente do servidor."
              action={() => {
                deleteEspelho(id);
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
                Excluir Espelho
              </Button>
            </AlertPopUp>
          </ModalButtons>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEspelho;
