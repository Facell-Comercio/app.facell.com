import { Button } from "@/components/ui/button";
import { useStoreTitulo } from "../titulo/store";
import { Plus } from "lucide-react";

const ButtonNovoTitulo = () => {
    const openModal = useStoreTitulo().openModal;

    return ( 
        <Button
          variant={"outline"}
          className="border-blue-200 dark:border-primary"
          onClick={() => openModal("")}
        >
          <Plus className="me-2" size={18} /> Nova Solicitação
        </Button>
     );
}
 
export default ButtonNovoTitulo;