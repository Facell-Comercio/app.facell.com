import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AlertPopUp from "@/components/custom/AlertPopUp";
import ModalButtons from "@/components/custom/ModalButtons";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useBordero } from "@/hooks/financeiro/useBordero";
import { VencimentosProps } from "@/pages/financeiro/components/ModalFindItemsBordero";
import { Trash } from "lucide-react";
import { useEffect, useRef } from "react";
import FormBordero from "./Form";
import { useStoreBordero } from "./store";

export type BorderoSchemaProps = {
  id: string;
  conta_bancaria?: string;
  banco?: string;
  id_conta_bancaria: string;
  codigo_banco?: string;
  data_pagamento: string;
  id_matriz: string;
  itens: VencimentosProps[];
};

const initialPropsBordero: BorderoSchemaProps = {
  id: "",
  conta_bancaria: "",
  banco: "",
  codigo_banco: "",
  id_conta_bancaria: "",
  data_pagamento: "",
  id_matriz: "",
  itens: [],
};

const ModalBordero = () => {
  const modalOpen = useStoreBordero().modalOpen;

  const toggleModal = useStoreBordero().toggleModal;

  const editModal = useStoreBordero().editModal;
  const modalEditing = useStoreBordero().modalEditing;
  const id = useStoreBordero().id;
  const formRef = useRef(null);

  const { data, isLoading } = useBordero().getOne(id);

  const { mutate: deleteBordero, isSuccess } = useBordero().deleteBordero();
  const newData: BorderoSchemaProps & Record<string, any> = {} as BorderoSchemaProps &
    Record<string, any>;

  for (const key in data?.data) {
    if (typeof data?.data[key] === "number") {
      newData[key] = String(data?.data[key]);
    } else if (data?.data[key] === null) {
      newData[key] = "";
    } else {
      newData[key] = data?.data[key];
    }
  }

  if (newData.itens && newData.itens.length > 0) {
    const newVencimento = newData.itens.map((item: VencimentosProps) => {
      return {
        ...item,
        previsao: item.previsao || "",
        valor_pago: item.valor_pago || "0",
        num_doc: item.num_doc || "",
        id_dda: item.id_dda || "",
        tipo_baixa: item.tipo_baixa || "",
        data_pagamento: item.data_pagamento || "",
        id_status: item.id_status || "",
        obs: item.obs || "",
      };
    });

    if (newVencimento[0].id_titulo) {
      // @ts-ignore
      newData.vencimentos = newVencimento;
    } else {
      newData.vencimentos = [];
    }
  }

  function handleClickCancel() {
    editModal(false);
  }

  async function excluirBordero() {
    deleteBordero({ id });
  }

  useEffect(() => {
    if (isSuccess) {
      editModal(false);
      toggleModal();
    }
  }, [isSuccess]);

  return (
    <Dialog open={modalOpen} onOpenChange={toggleModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? `Borderô: ${id}` : "Novo Borderô"}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh]">
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
                className={`text-white justify-self-start ${!modalEditing && "hidden"}`}
              >
                <Trash className="me-2" />
                Excluir Borderô
              </Button>
            </AlertPopUp>
          </ModalButtons>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalBordero;
