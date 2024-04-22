import ModalButtons from "@/components/custom/ModalButtons";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useTituloPagar } from "@/hooks/useTituloPagar";
import { useRef } from "react";
import FormTituloPagar from "./Form";
import { TituloSchemaProps } from "./form-data";
import {
  Historico,
  ItemRateioTitulo,
  initialPropsTitulo,
  useStoreTitulo,
} from "./store";

export type DataSchemaProps = {
  titulo: TituloSchemaProps;
  itens_rateio: ItemRateioTitulo[];
  historico: Historico[];
};

const ModalTituloPagar = () => {
  const modalOpen = useStoreTitulo().modalOpen;
  const closeModal = useStoreTitulo().closeModal;
  const modalEditing = useStoreTitulo().modalEditing;
  const editModal = useStoreTitulo().editModal;
  const id = useStoreTitulo().id;
  const formRef = useRef(null);

  const { data, isLoading } = useTituloPagar().getOne(id);

  const titulo = data?.data.titulo;
  const itens = data?.data.itens;
  const itens_rateio = data?.data.itens_rateio;
  const historico = data?.data.historico;

  if (titulo && itens_rateio && historico) {
    Object.keys(titulo).forEach((propriedade) => {
      if (titulo[propriedade] === null) {
        titulo[propriedade] = "";
      } else if (typeof titulo[propriedade] === "number") {
        titulo[propriedade] = titulo[propriedade].toString();
      }
    });

    itens.forEach((objeto: any) => {
      Object.keys(objeto).forEach((propriedade) => {
        if (objeto[propriedade] === null) {
          objeto[propriedade] = "";
        } else if (typeof objeto[propriedade] === "number") {
          objeto[propriedade] = objeto[propriedade].toString();
        }
      });
    });

    console.log('itens_banco: ', itens)

    itens_rateio.forEach((objeto: any) => {
      Object.keys(objeto).forEach((propriedade) => {
        if (objeto[propriedade] === null) {
          objeto[propriedade] = "";
        } else if (typeof objeto[propriedade] === "number") {
          objeto[propriedade] = objeto[propriedade].toString();
        }
      });
    });

    historico.forEach((objeto: any) => {
      Object.keys(objeto).forEach((propriedade) => {
        if (objeto[propriedade] === null) {
          objeto[propriedade] = "";
        } else if (typeof objeto[propriedade] === "number") {
          objeto[propriedade] = objeto[propriedade].toString();
        }
      });
    });
  }

  function handleClickCancel() {
    editModal(false);
    // closeModal();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {id ? `Solicitação: ${id}` : "Nova Solicitação"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="min-h-[70vh]">
          {modalOpen && !isLoading ? (
            <FormTituloPagar
              id={id}
              data={
                id
                  ? {...titulo, itens, itens_rateio, historico}
                  : initialPropsTitulo
              }
              formRef={formRef}
            />
          ) : (
            <ScrollArea>
              <div className="flex gap-3 w-full h-full">
                <div className="flex-1 flex flex-col gap-3">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-72" />
                  <Skeleton className="h-72" />
                  <Skeleton className="h-24" />
                </div>

                <div className="w-72 flex flex-col gap-3">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />

                  <Skeleton className="self-end mt-auto justify-self-end w-44 h-16" />
                </div>
              </div>
            </ScrollArea>
          )}
        </ScrollArea>
        {/* <DialogFooter>
          <ModalButtons
            id={id}
            modalEditing={modalEditing}
            edit={() => editModal(true)}
            cancel={handleClickCancel}
            formRef={formRef}
          />
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default ModalTituloPagar;
