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

const TituloPagarModal = ({idTitulo, setIdTitulo}) => {

    
    if(!idTitulo) return null;
    if(idTitulo === 'new'){
        return ( <Dialog open={true}  onOpenChange={()=>setIdTitulo(null)} >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo titulo</DialogTitle>
            
          </DialogHeader>
        </DialogContent>
      </Dialog>
       );
    }
    const {data, isLoading} = useQuery({queryKey: [`titulo:${idTitulo}`], queryFn: ()=>useApi().financeiro.contasPagar.fetchTitulo({id: idTitulo})})

    return ( <Dialog open={idTitulo}  onOpenChange={()=>setIdTitulo(null)} modal='true'>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{idTitulo === 'new' ? 'Novo titulo' : `Titulo: ${idTitulo}`}</DialogTitle>
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
 
export default TituloPagarModal;