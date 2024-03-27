import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";

import ModalButtons from "@/components/custom/ModalButtons";
import { Skeleton } from "@/components/ui/skeleton";
import { useFornecedores } from "@/hooks/useFornecedores";
import FormPlanoContas from "./FormPlanoContas";
import { useStorePlanoContas } from "./store-plano-contas";

export type PlanoContasSchema = {
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

const ModalPlanoContas = () => {
  const modalOpen = useStorePlanoContas().modalOpen
  const closeModal = useStorePlanoContas().closeModal
  const modalEditing = useStorePlanoContas().modalEditing
  const editModal = useStorePlanoContas().editModal
  const id = useStorePlanoContas().id

  const { data, isLoading } = useFornecedores().useGetOne(id)
  const newData: PlanoContasSchema & Record<string, any> = {} as PlanoContasSchema & Record<string, any>;
  
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
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent className="min-w-[80vw] sm:w-[95vw] p-2 sm:p-5 max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{id ? `Plano de Contas: ${id}` : "Novo Plano de Contas"}</DialogTitle>
        </DialogHeader>
        {modalOpen&&!isLoading?<FormPlanoContas id={id} data={newData}/>:(
          <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
          <Skeleton className="w-full row-span-1" />
          <Skeleton className="w-full row-span-3" />
        </div>
        )}
        <DialogFooter>
          <ModalButtons id={id} modalEditing={modalEditing} save={handleClickSave} inative={handleClickInative} edit={()=>editModal(true)} cancel={handleClickCancel}/>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalPlanoContas;
