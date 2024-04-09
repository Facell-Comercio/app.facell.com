import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrcamento } from "@/hooks/useOrcamento";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Save } from "lucide-react";
import { useRef } from "react";
import { FaRegCircleXmark } from "react-icons/fa6";
import FormCadastro from "./Form";
import { useStoreCadastro } from "./store";

export type CadastroSchema = {
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

const initialPropsCadastro: CadastroSchema = {
  // Dados Cadastro
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

const ModalCadastro = () => {
  const modalOpen = useStoreCadastro().modalOpen;
  const closeModal = useStoreCadastro().closeModal;
  const id = useStoreCadastro().id;
  const formRef = useRef(null);

  const { data, isLoading } = useOrcamento().getOne(id);
  const newData: CadastroSchema & Record<string, any> = {} as CadastroSchema &
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

  function handleClickReply(
    ref: React.MutableRefObject<HTMLFormElement | null>
  ) {
    ref.current && ref.current.requestSubmit();
  }

  return (
    <div>
      <Dialog open={modalOpen} onOpenChange={() => closeModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {id ? `Cadastro: ${id}` : "Novo cadastro"}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            {modalOpen && !isLoading ? (
              <FormCadastro
                id={id}
                data={newData.id ? newData : initialPropsCadastro}
                formRef={formRef}
              />
            ) : (
              <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
                <Skeleton className="w-full row-span-1" />
                <Skeleton className="w-full row-span-3" />
              </div>
            )}
          </ScrollArea>
          <DialogFooter className="flex gap-2 items-end flex-wrap">
            <Button onClick={() => closeModal()} variant={"secondary"}>
              <FaRegCircleXmark className="me-2 text-xl" />
              Cancelar
            </Button>
            <Button
              type="submit"
              className="dark:text-white"
              onClick={() => handleClickReply(formRef)}
            >
              <Save className="me-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalCadastro;
