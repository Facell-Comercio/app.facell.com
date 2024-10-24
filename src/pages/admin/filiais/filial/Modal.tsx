import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ModalButtons from "@/components/custom/ModalButtons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useFilial } from "@/hooks/useFilial";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useRef } from "react";
import Form from "./Form";
import { FilialFormData } from "./form-data";
import { useStoreFilial } from "./store";

const initialProps: FilialFormData = {
  id: "",
  active: true,
  nome: "",
  id_grupo_economico: "",
  id_matriz: "",

  nome_fantasia: "",
  razao: "",
  telefone: "",
  email: "",

  cnpj: "",
  apelido: "",
  cod_datasys: "",
  cnpj_datasys: "",

  logradouro: "",
  numero: "",
  complemento: "",
  cep: "",
  municipio: "",
  uf: "",
};

const ModalDepartamento = () => {
  const modalOpen = useStoreFilial((state) => state.modalOpen);
  const closeModal = useStoreFilial((state) => state.closeModal);
  const modalEditing = useStoreFilial((state) => state.modalEditing);
  const editModal = useStoreFilial((state) => state.editModal);
  const id = useStoreFilial((state) => state.id);
  const formRef = useRef(null);

  const { data, isLoading } = useFilial().getOne(id);
  const newData: FilialFormData & Record<string, any> = {} as FilialFormData & Record<string, any>;

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
  }

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? `Filial: ${id}` : "Nova filial"}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <Form id={id} data={newData?.id ? newData : initialProps} formRef={formRef} />
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

export default ModalDepartamento;
