import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useApi } from "@/hooks/use-api";
import { useQuery } from "@tanstack/react-query";

const ModalTituloPagar = ({titulo, setTitulo}) => {

    
    if(!titulo) return null;
    if(titulo === 'new'){
        return ( <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo titulo</DialogTitle>
            
          </DialogHeader>
        </DialogContent>
      </Dialog>
       );
    }
    const {data, isLoading} = useQuery({queryKey: [`titulo:${titulo}`], queryFn: ()=>useApi().financeiro.contasPagar.fetchTitulo({id: titulo})})

    return ( <Dialog open={titulo}  onOpenChange={()=>setTitulo(null)} modal='true'>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{titulo === 'new' ? 'Novo titulo' : `Titulo: ${titulo}`}</DialogTitle>
            <div className='d-flex gap-3 p-2'>
                {isLoading && 'Carregando...'}
                {data && (
                    <div>{data.descricao}</div>
                )}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
       );
}
 
export default ModalTituloPagar;