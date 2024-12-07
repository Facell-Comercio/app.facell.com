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
import { useUsers } from "@/hooks/useUsers";
import { Filial } from "@/types/filial-type";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useRef } from "react";
import Form from "./Form";
import { UserFormData } from "./form-data";
import { useStoreUser } from "./store";

const initialProps: UserFormData = {
  id: undefined,
  active: true,
  nome: "",
  email: "",
  img_url: "",

  updateFiliais: false,
  filiais: [],
  updateDepartamentos: false,
  departamentos: [],
  updateCentrosCusto: false,
  centros_custo: [],
  updatePerfis: false,
  perfis: [],
  updatePermissoes: false,
  permissoes: [],
};

const ModalUser = () => {
  const modalOpen = useStoreUser().modalOpen;
  const closeModal = useStoreUser().closeModal;
  const modalEditing = useStoreUser().modalEditing;
  const editModal = useStoreUser().editModal;
  const id = useStoreUser().id;
  const formRef = useRef(null);

  const { data, isLoading } = useUsers().getOne(id);
  const userData = data;

  for (const key in userData) {
    if (typeof userData[key] === "number") {
      userData[key] = String(userData[key]);
    } else if (userData[key] === null) {
      userData[key] = "";
    } else {
      userData[key] = userData[key];
    }
  }
  userData?.filiais?.forEach((e: Filial) => (e.id = e?.id?.toString() || ""));
  userData?.departamentos?.forEach((e: Filial) => (e.id = e?.id?.toString() || ""));
  userData?.centros_custo?.forEach((e: Filial) => (e.id = e?.id?.toString() || ""));
  userData?.perfis?.forEach((e: Filial) => (e.id = e?.id?.toString() || ""));
  userData?.permissoes?.forEach((e: Filial) => (e.id = e?.id?.toString() || ""));

  function handleClickCancel() {
    editModal(false);
  }

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? `` : "Novo Usuário"}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <Form id={id} data={userData?.id ? userData : initialProps} formRef={formRef} />
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

export default ModalUser;
