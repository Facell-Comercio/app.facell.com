import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { useEffect } from "react";
import { BtnCopiarTitulo } from "./components/BtnCopiarTitulo";
import { BtnCriarRecorrencia } from "./components/BtnCriarRecorrencia";
import FormTituloPagar from "./Form";
import { TituloSchemaProps, useFormTituloData } from "./form-data";
import { calcularDataPrevisaoPagamento } from "./helpers/helper";
import { Historico, ItemRateioTitulo, initialPropsTitulo, useStoreTituloPagar } from "./store";

export type DataSchemaProps = {
  titulo: TituloSchemaProps;
  itens_rateio: ItemRateioTitulo[];
  historico: Historico[];
};

const ModalTituloPagar = ({
  handleInsertTitulo,
}: {
  handleInsertTitulo?: (id_titulo: number) => void;
}) => {
  const modalOpen = useStoreTituloPagar().modalOpen;
  const closeModal = useStoreTituloPagar().closeModal;
  const id = useStoreTituloPagar().id;
  const recorrencia = useStoreTituloPagar().recorrencia;
  const copyData = useStoreTituloPagar().copyData;
  // const formRef = useRef(null);
  useEffect(() => {}, [id]);

  const { data, isLoading } = useTituloPagar().getOne(id);

  const titulo = data?.data.titulo;
  let vencimentos = data?.data.vencimentos || [];
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

  if (recorrencia) {
    vencimentos = [];
    vencimentos.push({
      data_vencimento: recorrencia.data_vencimento,
      data_prevista: calcularDataPrevisaoPagamento(new Date(recorrencia.data_vencimento)),
      valor: recorrencia.valor,
      cod_barras: "",
      qr_code: "",
      id: "fake",
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

  let modalData = initialPropsTitulo;
  if (recorrencia) {
    modalData = {
      ...titulo,
      id: "",
      status: "",
      id_status: "1",
      url_boleto: "",
      url_contrato: "",
      url_nota_fiscal: "",
      url_planilha: "",
      url_txt: "",
      url_xml: "",
      valor: recorrencia.valor,
      data_vencimento: recorrencia.data_vencimento,
      data_emissao: new Date().toDateString(),
      data_prevista: calcularDataPrevisaoPagamento(new Date(recorrencia.data_vencimento)),
      vencimentos,
      itens_rateio,
      id_departamento: "",
      id_recorrencia: recorrencia.id,
      created_at: undefined,
    };
  } else if (copyData) {
    // @ts-ignore
    modalData = { ...copyData };
  } else if (id) {
    modalData = { ...titulo, vencimentos, itens_rateio, historico };
  }

  // * [ FORM ]
  const { form } = useFormTituloData({
    ...modalData,
    update_vencimentos: false,
    update_rateio: false,
  });
  const podeCriarRecorrencia = id && (parseInt(modalData?.id_status) || 0) > 0;

  // console.log(form.formState.errors);

  if (!modalOpen) return null;

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent className="min-w-[96vw] xl:min-w-1">
        <DialogHeader className="flex flex-row items-center gap-3">
          <DialogTitle>
            {!!id && !recorrencia ? `Solicitação: ${id}` : "Nova Solicitação"}
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
          <BtnCopiarTitulo copyData={modalData} />
          {podeCriarRecorrencia && <BtnCriarRecorrencia form={form} />}
        </DialogHeader>
        {/* <section className="min-h-[80vh] sm:min-h-[70vh] z-[999] overflow-auto scroll-thin">
          
        </section> */}
        {!isLoading && form ? (
          <FormTituloPagar
            id={!!id && !recorrencia ? id : ""}
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

export default ModalTituloPagar;
