import { Button } from "@/components/ui/button";
import { useStoreTitulo } from "./titulo/store-titulo";

const ButtonNewTitulo = () => {
    const modalTituloOpen = useStoreTitulo().modalTituloOpen
    const openModalTitulo = useStoreTitulo().openModalTitulo
    function handleClick(){
        openModalTitulo('')
    }
    return ( <Button disabled={modalTituloOpen} onClick={handleClick}>Novo título</Button> );
}
 
export default ButtonNewTitulo;