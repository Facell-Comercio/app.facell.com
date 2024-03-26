import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";
import { Button } from "@/components/ui/button";
import { PenLine, Save } from "lucide-react";
import { FaRegCircleXmark } from "react-icons/fa6";
import { GrCircleAlert } from "react-icons/gr";

import { Skeleton } from "@/components/ui/skeleton";
import { useFornecedores } from "@/hooks/useFornecedores";
import FormFornecedor from "./FormFornecedor";
import { useStoreFornecedor } from "./store-fornecedor";

export type FornecedorSchema = {
  id: string;
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
}

const ModalFornecedor = () => {
  const modalOpen = useStoreFornecedor().modalOpen
  const closeModal = useStoreFornecedor().closeModal
  const modalEditing = useStoreFornecedor().modalEditing
  const editModal = useStoreFornecedor().editModal
  const id = useStoreFornecedor().id

  const { data, isLoading } = useFornecedores().useGetOne(id)
  const newData: FornecedorSchema & Record<string, any> = {} as FornecedorSchema & Record<string, any>;
  
  for (const key in data?.data) {
    if (typeof data?.data[key] === 'number') {
      newData[key] = String(data?.data[key]);
    }else if (data?.data[key] === null) {
      newData[key] = "";
    } else {
      newData[key] = data?.data[key];
    }
  }
  
  console.log(newData);

  function handleClickSave(){
    editModal(false);
    closeModal();
  }
  function handleClickCancel(){
    editModal(false);
    closeModal();
  }
  function handleClickInative(){
    editModal(false);
    closeModal();
  }
  

  return (
    <Dialog open={modalOpen} onOpenChange={() => closeModal()}>
      <DialogContent className="min-w-[80vw] sm:w-[95vw] p-2 sm:p-5 h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{id ? `Fornecedor: ${id}` : "Novo fornecedor"}</DialogTitle>
        </DialogHeader>
        {modalOpen&&!isLoading?<FormFornecedor id={id} data={newData}/>:(
          <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
          <Skeleton className="w-full row-span-1" />
          <Skeleton className="w-full row-span-3" />
        </div>
        )}
        <DialogFooter>
          <>
          
          {!id && (
          <div className="flex gap-2 justify-end flex-wrap">
            <Button type="submit" size="lg" variant={"secondary"} onClick={handleClickCancel}>
              <FaRegCircleXmark className="me-2 text-xl" />
              Cancelar
            </Button>
            <Button type="submit" size="lg"  onClick={handleClickSave}><Save className="me-2"/>Salvar</Button>
          </div>)
          }
          {id && modalEditing && (
          <div className="flex gap-2 justify-end flex-wrap">
            
          <Button type="submit" size="lg" variant={"destructive"} onClick={handleClickInative}>
            <GrCircleAlert className="me-2"/>
            Inativar
          </Button>

          <Button type="submit" size="lg" variant={"secondary"} onClick={handleClickCancel}>
              <FaRegCircleXmark className="me-2 text-xl"/>
              Cancelar
            </Button>

          <Button type="submit" size="lg" onClick={handleClickSave}>
            <Save className="me-2" />
            Salvar
          </Button>
          </div>)
          }
          {id && !modalEditing && (
          <div className="flex gap-2 justify-end flex-wrap">
          <Button type="submit" size="lg" variant={"destructive"} onClick={handleClickInative}>
            <GrCircleAlert className="me-2 text-xl" />
            Inativar
          </Button>
          <Button type="submit" size="lg" onClick={()=>editModal(true)}>
            <PenLine className="me-2" />
            Editar
          </Button>
          </div>)
          }
          </>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalFornecedor;
