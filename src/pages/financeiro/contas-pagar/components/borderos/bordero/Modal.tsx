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
import { useBordero } from "@/hooks/useBordero";
import { api } from "@/lib/axios";
import ModalBorderos, {
  BorderoProps,
} from "@/pages/financeiro/components/ModalBorderos";
import { TitulosProps } from "@/pages/financeiro/components/ModalTitulos";
import { ArrowUpDown } from "lucide-react";
import { useRef, useState } from "react";
import FormBordero from "./Form";
import { useStoreBordero } from "./store";

export type BorderoSchemaProps = {
  id: string;
  conta_bancaria?: string;
  banco?: string;
  id_conta_bancaria: string;
  data_pagamento: string;
  id_matriz: string;
  titulos: TitulosProps[];
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
  const [modalBorderosOpen, setModalBorderosOpen] = useState<boolean>(false);
  const modalOpen = useStoreBordero().modalOpen;
  // const closeModal = useStoreBordero().closeModal;
  const toggleModal = useStoreBordero().toggleModal;
  const modalEditing = useStoreBordero().modalEditing;
  const editModal = useStoreBordero().editModal;
  const toggleGetTitulo = useStoreBordero().toggleGetTitulo;
  const checkedTitulos = useStoreBordero().checkedTitulos;
  const id = useStoreBordero().id;
  const formRef = useRef(null);

  const { data, isLoading } = useBordero().getOne(id);
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

  if (newData.titulos && newData.titulos.length > 0) {
    const newTitulos = newData.titulos.map((titulo: TitulosProps) => {
      return {
        checked: titulo.checked,
        id_titulo: titulo.id_titulo,
        vencimento: titulo.vencimento,
        nome_fornecedor: titulo.nome_fornecedor,
        valor_total: titulo.valor_total,
        num_doc: titulo.num_doc || "",
        descricao: titulo.descricao,
        filial: titulo.filial,
        data_pagamento: titulo.data_pagamento || "",
      };
    });
    newData.titulos = newTitulos;
  }

  async function handleSelectionBorderos(item: BorderoProps) {
    const transferredData = {
      new_id: item.id,
      titulos: checkedTitulos,
    };
    await api.put(
      `financeiro/contas-a-pagar/bordero/transfer`,
      transferredData
    );
    console.log(transferredData);
    toggleModal();
  }

  function handleClickCancel() {
    editModal(false);
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
            <AlertPopUp
              title="Deseja realmente realizar essa tranferência de titulos?"
              description="Os títulos desse borderô serão transferidos para o outro borderô."
              action={() => {
                setModalBorderosOpen(true);
                toggleGetTitulo();
              }}
            >
              <Button
                type={"button"}
                size="lg"
                variant={"secondary"}
                className="dark:text-white justify-self-start"
              >
                <ArrowUpDown className="me-2" />
                Transferir Títulos
              </Button>
            </AlertPopUp>
          </ModalButtons>
          <ModalBorderos
            open={modalBorderosOpen}
            handleSelecion={handleSelectionBorderos}
            onOpenChange={() => setModalBorderosOpen((prev) => !prev)}
            id_matriz={newData.id_matriz || ""}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalBordero;
