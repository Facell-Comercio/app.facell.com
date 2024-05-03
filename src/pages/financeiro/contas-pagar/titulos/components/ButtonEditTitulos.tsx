import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useStoreAlteracoesLote } from "../alteracao-lote/store";

const ButtonEditTitulos = () => {
    const openModalAlteracoesLote = useStoreAlteracoesLote().openModal;

    return ( 
        <Button
            variant={"outline"}
            className="border border-orange-200 dark:border-orange-600"
            onClick={() => openModalAlteracoesLote("")}
          >
            <Edit className="me-2" size={18} /> Alterar em lote
          </Button>
     );
}
 
export default ButtonEditTitulos;