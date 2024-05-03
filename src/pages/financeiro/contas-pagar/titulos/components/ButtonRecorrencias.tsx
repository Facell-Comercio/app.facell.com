import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Repeat2 } from "lucide-react";
import { useStoreRecorrencias } from "../recorrencias/store";
import { useTituloPagar } from "@/hooks/useTituloPagar";

const ButtonRecorrencias = () => {
    const {data} = useTituloPagar().getRecorrencias({ filters: {}})
    const openModalRecorrencias = useStoreRecorrencias().openModal;
    const recorrencias = data?.data?.rows || []
    // @ts-ignore
    const qtdeRecorrencias = recorrencias.reduce((acc, curr)=>{
        if(curr.lancado == 0){
            return acc + 1
        }else{
            return acc
        }
    },0);

    return ( 
        <Button className="relative" variant={"outline"} onClick={() => openModalRecorrencias("")}>
          <Repeat2 className="me-2" size={18} /> Recorrências
          {qtdeRecorrencias > 0 &&
              <Badge variant={'destructive'} className="absolute -top-3 end-2">{qtdeRecorrencias}</Badge>
          }
        </Button>
     );
}
 
export default ButtonRecorrencias;