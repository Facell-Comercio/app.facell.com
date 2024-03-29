import { Button } from "@/components/ui/button";
import { useStoreTitulo } from "./titulo/store-titulo";

const ButtonNewTitulo = () => {
    const modalOpen = useStoreTitulo().modalOpen
    // const openModalTitulo = useStoreTitulo().openModalTitulo
    function handleClick(){
        // openModalTitulo('')
        console.log("Deu certo");
        
    }
    return ( <Button disabled={modalOpen} onClick={handleClick}>Novo título</Button> );
}
 
export default ButtonNewTitulo;