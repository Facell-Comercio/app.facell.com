import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useTituloPagar } from "@/hooks/useTituloPagar";
import { useRef } from "react";
import FormTituloPagar from "./Form";
import { TituloSchemaProps } from "./form-data";
import { calcularDataPrevisaoPagamento } from "./helper";
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
  const id = useStoreTitulo().id;
  const recorrencia = useStoreTitulo().recorrencia;
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
  }

  if (itens) {
    itens.forEach((objeto: any) => {
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

  let modalData = initialPropsTitulo;
  if (recorrencia) {
    modalData = {
      ...titulo,
      id: "",
      status: "Solicitado",
      id_status: "1",
      url_boleto: "",
      url_contrato: "",
      url_nota_fiscal: "",
      url_planilha: "",
      url_txt: "",
      url_xml: "",
      url_xml_nota: "",
      data_vencimento: recorrencia.data_vencimento,
      data_emissao: new Date(),
      data_prevista: calcularDataPrevisaoPagamento(
        new Date(recorrencia.data_vencimento)
      ),
      itens,
      itens_rateio,
      id_recorrencia: recorrencia.id
    };
  } else if (id) {
    modalData = { ...titulo, itens, itens_rateio, historico };
  }

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {!!id && !recorrencia ? `Solicitação: ${id}` : "Nova Solicitação"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="min-h-[70vh]">
          {modalOpen && !isLoading ? (
            <FormTituloPagar
              id={!!id && !recorrencia ? id : ""}
              data={modalData}
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
