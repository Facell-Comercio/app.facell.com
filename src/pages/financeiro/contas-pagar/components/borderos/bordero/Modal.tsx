import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";

import ModalButtons from "@/components/custom/ModalButtons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useBordero } from "@/hooks/useBordero";
import { useRef } from "react";
import FormBordero from "./Form";
import { useStoreBordero } from "./store";

export type BorderoSchemaProps = {
  id: string;
  conta_bancaria: string;
  id_conta_bancaria: string;
  data_pagamento: string;
  titulos: TitulosProps[];
};

type TitulosProps = {
  id_titulo: string;
  vencimento: string;
  nome_fornecedor: string;
  valor_total: string;
  num_doc: string;
  descricao: string;
  filial: string;
  data_pagamento: string;
};

const initialPropsBordero: BorderoSchemaProps = {
  id: "",
  conta_bancaria: "",
  id_conta_bancaria: "",
  data_pagamento: "",
  titulos: [
    {
      id_titulo: "teste",
      vencimento: "teste",
      nome_fornecedor: "teste",
      valor_total: "teste",
      num_doc: "teste",
      descricao: "teste",
      filial: "teste",
      data_pagamento: "teste",
    },
  ],
};

const ModalBordero = () => {
  const modalOpen = useStoreBordero().modalOpen;
  const closeModal = useStoreBordero().closeModal;
  const modalEditing = useStoreBordero().modalEditing;
  const editModal = useStoreBordero().editModal;
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

  console.log(newData);

  function handleClickCancel() {
    editModal(false);
    closeModal();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
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
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalBordero;
