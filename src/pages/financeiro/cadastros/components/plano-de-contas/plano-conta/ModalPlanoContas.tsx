import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";

import ModalButtons from "@/components/custom/ModalButtons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlanoContas } from "@/hooks/usePlanoConta";
import { useRef } from "react";
import FormPlanoContas from "./FormPlanoContas";
import { useStorePlanoContas } from "./store-plano-contas";

export type PlanoContasSchema = {
  id: string,
  codigo: string,
  ativo: boolean,
  descricao: string,
  codigo_pai: string,
  descricao_pai: string,

  // Parâmetros
  nivel: string,
  tipo: string,
  grupo_economico: string,
  codigo_conta_estorno: string,
}

const initialPropsPlanoContas: PlanoContasSchema = {
  // Identificador do plano de contas
  id: "",
  codigo: "",
  ativo: true,
  descricao: "",
  codigo_pai: "",
  descricao_pai: "",

  // Parâmetros
  nivel: "",
  tipo: "",
  grupo_economico: "",
  codigo_conta_estorno: "",
}

const ModalPlanoContas = () => {
  const modalOpen = useStorePlanoContas().modalOpen
  const closeModal = useStorePlanoContas().closeModal
  const modalEditing = useStorePlanoContas().modalEditing
  const editModal = useStorePlanoContas().editModal
  const id = useStorePlanoContas().id
  const formRef = useRef(null)
  

  const { data, isLoading } = usePlanoContas().useGetOne(id)
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

  function handleClickCancel(){
    editModal(false);
    closeModal();
  }
  

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? `Plano de Contas: ${id}` : "Novo Plano de Contas"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen&&!isLoading?<FormPlanoContas id={id} data={newData.id ? newData : initialPropsPlanoContas} formRef={formRef}/>:(
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
            <Skeleton className="w-full row-span-1" />
            <Skeleton className="w-full row-span-3" />
          </div>
          )}
        </ScrollArea>
        <DialogFooter>
          <ModalButtons id={id} modalEditing={modalEditing} edit={()=>editModal(true)} cancel={handleClickCancel} formRef={formRef}/>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalPlanoContas;
