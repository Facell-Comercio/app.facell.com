import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useTituloReceber } from "@/hooks/financeiro/useTituloReceber";
import { useEffect } from "react";
import { BtnCopiarTituloReceber } from "./components/BtnCopiarTituloReceber";
import FormTituloReceber from "./form";
import { TituloCRSchemaProps, useFormTituloCRData } from "./form-data";
import {
  Historico,
  initialPropsTituloCR,
  ItemRateioTituloCR,
  useStoreTituloReceber,
} from "./store";

export type DataSchemaProps = {
  titulo: TituloCRSchemaProps;
  itens_rateio: ItemRateioTituloCR[];
  historico: Historico[];
};

const ModalTituloReceber = ({
  handleInsertTitulo,
}: {
  handleInsertTitulo?: (id_titulo: number) => void;
}) => {
  const modalOpen = useStoreTituloReceber().modalOpen;
  const closeModal = useStoreTituloReceber().closeModal;
  const id = useStoreTituloReceber().id;
  const copyData = useStoreTituloReceber().copyData;
  // const formRef = useRef(null);
  useEffect(() => {}, [id]);

  const { data, isLoading } = useTituloReceber().getOne(id);

  const titulo = data?.titulo;
  let vencimentos = data?.vencimentos || [];
  const itens_rateio = data?.itens_rateio;

  const historico = data?.historico;

  if (titulo && itens_rateio && historico) {
    Object.keys(titulo).forEach((propriedade) => {
      if (titulo[propriedade] === null) {
        titulo[propriedade] = "";
      } else if (typeof titulo[propriedade] === "number") {
        titulo[propriedade] = titulo[propriedade].toString();
      }
    });
  }

  if (vencimentos && vencimentos.length > 0) {
    vencimentos.forEach((objeto: any) => {
      Object.keys(objeto).forEach((propriedade) => {
        if (objeto[propriedade] === null) {
          objeto[propriedade] = "";
        } else if (typeof objeto[propriedade] === "number") {
          objeto[propriedade] = objeto[propriedade].toString();
        }
      });
    });
  }

  if (itens_rateio) {
    itens_rateio.forEach((objeto: any) => {
      Object.keys(objeto).forEach((propriedade) => {
        if (objeto[propriedade] === null) {
          objeto[propriedade] = "";
        } else if (typeof objeto[propriedade] === "number") {
          objeto[propriedade] = objeto[propriedade].toString();
        }

        if (propriedade == "valor") {
          objeto[propriedade] = parseFloat(objeto[propriedade]).toFixed(4);
        }
      });
    });
  }

  if (historico) {
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

  let modalData = initialPropsTituloCR;
  if (copyData) {
    // @ts-ignore
    modalData = { ...copyData };
  } else if (id) {
    modalData = { ...titulo, vencimentos, itens_rateio, historico };
  }

  // * [ FORM ]
  const { form } = useFormTituloCRData({
    ...modalData,
    update_vencimentos: false,
    update_rateio: false,
  });

  // console.log(form.formState.errors);

  if (!modalOpen) return null;

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent className="min-w-[96vw] xl:min-w-1">
        <DialogHeader className="flex flex-row items-center gap-3">
          <DialogTitle>{!!id ? `Solicitação: ${id}` : "Nova Solicitação"}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
          <BtnCopiarTituloReceber copyData={modalData} />
        </DialogHeader>
        {/* <section className="min-h-[80vh] sm:min-h-[70vh] z-[999] overflow-auto scroll-thin">
          
        </section> */}
        {!isLoading && form ? (
          <FormTituloReceber
            id={id || ""}
            form={form}
            handleInsertTitulo={handleInsertTitulo}
            // formRef={formRef}
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

export default ModalTituloReceber;
