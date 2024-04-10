import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrcamento } from "@/hooks/useOrcamento";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Save } from "lucide-react";
import { useRef } from "react";
import { FaRegCircleXmark } from "react-icons/fa6";
import FormCadastro from "./Form";
import { cadastroSchemaProps } from "./form-data";
import { useStoreCadastro } from "./store";

const data = new Date();

const ano = data.getFullYear();
const mes = String(data.getMonth() + 1).padStart(2, "0"); // Adiciona um zero à esquerda se o mês for menor que 10
const dia = String(data.getDate()).padStart(2, "0"); // Adiciona um zero à esquerda se o dia for menor que 10

export const dataFormatada = `${ano}-${mes}-${dia}`;

const initialPropsCadastro: cadastroSchemaProps = {
  id: "",
  id_grupo_economico: "",
  grupo_economico: "",
  active: true,
  ref: dataFormatada,
  contas: [],
};

const ModalCadastro = () => {
  const modalOpen = useStoreCadastro().modalOpen;
  const closeModal = useStoreCadastro().closeModal;
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

  function handleClickReply(
    ref: React.MutableRefObject<HTMLFormElement | null>
  ) {
    ref.current && ref.current.requestSubmit();
  }

  return (
    <div>
      <Dialog open={modalOpen} onOpenChange={() => closeModal()}>
        <DialogContent>
          <ScrollArea className="max-h-[80vh]">
            {modalOpen && !isLoading ? (
              <FormCadastro
                id={id}
                data={newData.id ? newData : initialPropsCadastro}
                formRef={formRef}
              />
            ) : (
              <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
                <Skeleton className="w-full row-span-1" />
                <Skeleton className="w-full row-span-3" />
              </div>
            )}
          </ScrollArea>
          <DialogFooter className="flex gap-2 items-end flex-wrap">
            <Button onClick={() => closeModal()} variant={"secondary"}>
              <FaRegCircleXmark className="me-2 text-xl" />
              Cancelar
            </Button>
            <Button
              type="submit"
              className="dark:text-white"
              onClick={() => handleClickReply(formRef)}
            >
              <Save className="me-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalCadastro;
