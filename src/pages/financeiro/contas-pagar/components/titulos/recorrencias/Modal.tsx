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
import { useTituloPagar } from "@/hooks/useTituloPagar";
import { TitulosProps } from "@/pages/financeiro/components/ModalTitulos";
import { Trash } from "lucide-react";
import { useStoreRecorrencias } from "./store";


const ModalRecorrencias = () => {
  const modalOpen = useStoreRecorrencias().modalOpen;

  const toggleModal = useStoreRecorrencias().toggleModal;

  const editModal = useStoreRecorrencias().editModal;
  const modalEditing = useStoreRecorrencias().modalEditing;
  const id = useStoreRecorrencias().id;


  const { data, isLoading } = useTituloPagar().getRecorrencias();
  const { mutate: deleteRecorrencia } = useTituloPagar().deleteRecorrencia();

  console.log(data)
  function handleClickCancel() {
    editModal(false);
  }

  function excluirRecorrencia() {
    deleteRecorrencia({ id, titulos: data?.data.titulos });
    toggleModal();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={toggleModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recorrências</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <div className="flex flex-col gap-3">
              <p>Teste</p>
              <table className="border">
                <thead>
                  <tr>
                    <th className="text-start">Fornecedor</th>
                    <th className="text-start">Descrição</th>
                    <th className="text-start">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.rows?.map((rec, index)=>(
                    <tr key={`rec.${index}`}>
                      <td>{rec['id_fornecedor']}</td>
                      <td>{rec['descricao']}</td>
                      <td>{rec['valor']}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ModalRecorrencias;
