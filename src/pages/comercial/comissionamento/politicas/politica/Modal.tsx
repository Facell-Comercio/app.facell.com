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
  PoliticasProps,
  usePoliticas,
} from "@/hooks/comercial/usePoliticas";
import { Trash } from "lucide-react";
import { useEffect, useRef } from "react";
import FormPolitica from "./Form";
import { useStorePolitica } from "./store";

const initialPropsPolitica: PoliticasProps = {
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

const ModalPolitica = () => {
  const [
    modalOpen,
    closeModal,
    modalEditing,
    editModal,
    isPending,
    id,
  ] = useStorePolitica((state) => [
    state.modalOpen,
    state.closeModal,
    state.modalEditing,
    state.editModal,
    state.isPending,
    state.id,
  ]);

  const formRef = useRef(null);

  const { data, isLoading } =
    usePoliticas().getOne(id);

  const { mutate: deletePolitica, isSuccess } =
    usePoliticas().deletePolitica();
  const newDataPolitica: PoliticasProps &
    Record<string, any> = {} as PoliticasProps &
    Record<string, any>;

  for (const key in data) {
    if (typeof data[key] === "number") {
      newDataPolitica[key] = String(data[key]);
    } else if (data[key] === null) {
      newDataPolitica[key] = "";
    } else {
      newDataPolitica[key] = data[key];
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
              ? `Politica: ${id}`
              : "Novo Politica"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <FormPolitica
              id={id}
              data={
                id
                  ? newDataPolitica
                  : initialPropsPolitica
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
              description="Essa ação não pode ser desfeita. A politica será excluída definitivamente do servidor."
              action={() => {
                deletePolitica(id);
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
                Excluir Politica
              </Button>
            </AlertPopUp>
          </ModalButtons>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalPolitica;
