import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";

import ModalButtons from "@/components/custom/ModalButtons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrcamento } from "@/hooks/financeiro/useOrcamento";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { CircleFadingPlusIcon } from "lucide-react";
import { useRef } from "react";
import FormCadastro from "./Form";
import { cadastroSchemaProps } from "./form-data";
import { useStoreCadastro } from "./store";

const data = new Date();

const ano = data.getFullYear();
const mes = String(data.getMonth() + 1).padStart(2, "0"); // Adiciona um zero à esquerda se o mês for menor que 10
const dia = String(data.getDate()).padStart(2, "0"); // Adiciona um zero à esquerda se o dia for menor que 10

export const dataFormatada = `${ano}-${mes}-${dia}`;

export const initialPropsCadastro: cadastroSchemaProps = {
  id: "",
  id_grupo_economico: "",
  grupo_economico: "",
  active: true,
  ref: dataFormatada,
  contas: [],
};

const ModalCadastro = () => {
  const modalOpen = useStoreCadastro().modalOpen;
  // const closeModal = useStoreCadastro().closeModal;
  const toggleModal = useStoreCadastro().toggleModal;
  const openReplicateModal = useStoreCadastro().openReplicateModal;
  const modalEditing = useStoreCadastro((state) => state.modalEditing);
  const editModal = useStoreCadastro((state) => state.editModal);

  const id = useStoreCadastro().id;
  const formRef = useRef(null);

  const { data, isLoading } = useOrcamento().getOne(id);

  const newData: cadastroSchemaProps & Record<string, any> =
    {} as cadastroSchemaProps & Record<string, any>;

  for (const key in data?.data) {
    if (typeof data?.data[key] === "number") {
      newData[key] = String(data?.data[key]);
    } else if (data?.data[key] === null) {
      newData[key] = "";
    } else {
      newData[key] = data?.data[key];
    }
  }

  function handleClickCancel() {
    editModal(false);
    // closeModal();
  }

  return (
    <div>
      <Dialog open={modalOpen} onOpenChange={toggleModal}>
        <DialogContent>
          <ScrollArea className="max-h-[80vh]">
            {modalOpen && !isLoading ? (
              <FormCadastro
                id={id}
                data={id ? newData : initialPropsCadastro}
                formRef={formRef}
              />
            ) : (
              <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
                <Skeleton className="w-full row-span-1" />
                <Skeleton className="w-full row-span-3" />
              </div>
            )}
          </ScrollArea>
          <DialogFooter className="flex w-full gap-2 items-end flex-wrap">
            <ModalButtons
              id={id}
              modalEditing={modalEditing}
              edit={() => editModal(true)}
              cancel={handleClickCancel}
              formRef={formRef}
            >
              <Button
                type={"submit"}
                size="lg"
                variant={"secondary"}
                className="dark:text-white justify-self-start	mx-3"
                onClick={() => openReplicateModal(id || "")}
              >
                <CircleFadingPlusIcon className="me-2" />
                Replicar
              </Button>
            </ModalButtons>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalCadastro;
