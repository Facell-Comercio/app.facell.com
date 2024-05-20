import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";

import AlertPopUp from "@/components/custom/AlertPopUp";
import ModalButtons from "@/components/custom/ModalButtons";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useBordero } from "@/hooks/financeiro/useBordero";
import { VencimentosProps } from "@/pages/financeiro/components/ModalTitulos";
import { Trash } from "lucide-react";
import { useRef } from "react";
import FormBordero from "./Form";
import { useStoreMovimentoContabil } from "./store";

export type BorderoSchemaProps = {
  id: string;
  conta_bancaria?: string;
  banco?: string;
  id_conta_bancaria: string;
  data_pagamento: string;
  id_matriz: string;
  titulos: VencimentosProps[];
};

const initialPropsBordero: BorderoSchemaProps = {
  id: "",
  conta_bancaria: "",
  banco: "",
  id_conta_bancaria: "",
  data_pagamento: "",
  id_matriz: "",
  titulos: [],
};

const ModalBordero = () => {
  const modalOpen = useStoreMovimentoContabil().modalOpen;

  const toggleModal = useStoreMovimentoContabil().toggleModal;

  const editModal = useStoreMovimentoContabil().editModal;
  const modalEditing = useStoreMovimentoContabil().modalEditing;
  const id = useStoreMovimentoContabil().id;
  const formRef = useRef(null);

  const { data, isLoading } = useBordero().getOne(id);
  const { mutate: deleteBordero } = useBordero().deleteBordero();
  const newData: BorderoSchemaProps & Record<string, any> =
    {} as BorderoSchemaProps & Record<string, any>;

  for (const key in data?.data) {
    if (typeof data?.data[key] === "number") {
      newData[key] = String(data?.data[key]);
    } else if (data?.data[key] === null) {
      newData[key] = "";
    } else {
      newData[key] = data?.data[key];
    }
  }

  // ^ Observar se não ocorrerá nenhum erro com essa "gambiarra"
  if (newData.titulos && newData.titulos.length > 0) {
    const newTitulos = newData.titulos.map((titulo: VencimentosProps) => {
      return {
        checked: titulo.checked,
        id_titulo: titulo.id_titulo,
        status: titulo.status,
        previsao: titulo.previsao || "",
        nome_fornecedor: titulo.nome_fornecedor,
        valor_total: titulo.valor_total,
        num_doc: titulo.num_doc || "",
        descricao: titulo.descricao,
        filial: titulo.filial,
        data_pagamento: titulo.data_pagamento || "",
        id_status: titulo.id_status || "",
      };
    });

    if (newTitulos[0].id_titulo) {
      newData.titulos = newTitulos;
    } else {
      newData.titulos = [];
    }
  }

  // function pushSelectionBorderos(item: BorderoProps) {
  //   if (checkedTitulos.length) {
  //     const transferredData = {
  //       new_id: item.id,
  //       titulos: checkedTitulos,
  //     };
  //     transferTitulos(transferredData);
  //     toggleModal();
  //   } else {
  //     toast({
  //       title: "Nenhum título foi selecionado",
  //       duration: 3000,
  //       description:
  //         "Para realizar a tranferência de títulos é necessário selecionar alguns",
  //     });
  //   }
  //   // toggleGetTitulo(false);
  //   toggleModalBorderos();
  // }

  function handleClickCancel() {
    editModal(false);
  }

  function excluirBordero() {
    deleteBordero({ id, titulos: data?.data.titulos });
    toggleModal();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={toggleModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? `Borderô: ${id}` : "Novo Borderô"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <FormBordero
              id={id}
              data={newData.id ? newData : initialPropsBordero}
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
          >
            <div className="flex gap-2">
              <AlertPopUp
                title={"Deseja realmente excluir"}
                description="Essa ação não pode ser desfeita. O borderô será excluído definitivamente do servidor."
                action={() => {
                  excluirBordero();
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
                  Excluir Borderô
                </Button>
              </AlertPopUp>
            </div>
          </ModalButtons>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalBordero;
