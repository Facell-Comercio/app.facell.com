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
import { useFornecedores } from "@/hooks/useFornecedores";
import { useRef } from "react";
import FormFornecedor from "./FormFornecedor";
import { useStoreFornecedor } from "./store-fornecedor";

export type FornecedorSchema = {
  id: string;
  active?: boolean;
  cnpj: string;
  nome: string;
  razao: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  municipio: string;
  uf: string;
  email: string;
  telefone: string;
  id_forma_pagamento: string;
  id_tipo_chave_pix: string;
  chave_pix: string;
  id_banco: string;
  agencia: string;
  dv_agencia: string | null;
  conta: string;
  dv_conta: string;
  cnpj_favorecido: string;
  favorecido: string;
};

const initialPropsFornecedor: FornecedorSchema = {
  // Dados Fornecedor
  id: "",
  active: true,
  cnpj: "",
  nome: "",
  razao: "",
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  municipio: "",
  uf: "",
  email: "",
  telefone: "",

  // Dados Bancários
  id_forma_pagamento: "",
  id_tipo_chave_pix: "",
  id_banco: "",
  chave_pix: "",
  agencia: "",
  dv_agencia: "",
  conta: "",
  dv_conta: "",
  cnpj_favorecido: "",
  favorecido: "",
};

const ModalFornecedor = () => {
  const modalOpen = useStoreFornecedor().modalOpen;
  const closeModal = useStoreFornecedor().closeModal;
  const modalEditing = useStoreFornecedor().modalEditing;
  const editModal = useStoreFornecedor().editModal;
  const id = useStoreFornecedor().id;
  const formRef = useRef(null);

  const { data, isLoading } = useFornecedores().getOne(id);
  const newData: FornecedorSchema & Record<string, any> =
    {} as FornecedorSchema & Record<string, any>;

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
          <DialogTitle>
            {id ? `Fornecedor: ${id}` : "Novo fornecedor"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <FormFornecedor
              id={id}
              data={newData.id ? newData : initialPropsFornecedor}
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

export default ModalFornecedor;
