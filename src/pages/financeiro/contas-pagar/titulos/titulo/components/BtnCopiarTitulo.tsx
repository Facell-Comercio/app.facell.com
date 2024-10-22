import { Button } from "@/components/ui/button";
import { TituloSchemaProps } from "../form-data";
import { Copy, CopyCheck } from "lucide-react";
import { useStoreTituloPagar } from "../store";

export const BtnCopiarTitulo = ({ copyData }: { copyData: Partial<TituloSchemaProps> }) => {
    
    const openModal = useStoreTituloPagar((state)=>state.openModal)
    const [tituloCopiado, setTituloCopiado] = useStoreTituloPagar((state)=>[state.tituloCopiado, state.setTituloCopiado])
    
    const handleClickCopiar = () => {
        openModal({
            id: '',
            copyData: {
                ...copyData,
                id_recorrencia: undefined,
                id_status: '',
                data_emissao: new Date().toDateString(),
                num_doc: '',
                status: '',
                historico: [],
                url_boleto: '',
                url_xml: '',
                url_nota_fiscal: '',
                url_contrato: '',
                url_planilha: '',
                url_txt: '',
            }
        })
        setTituloCopiado(true)
        setTimeout(() => {
            setTituloCopiado(false)
        }, 5000)
    }

    return (
        <Button onClick={handleClickCopiar} type="button" size={'sm'} variant={tituloCopiado ? 'success' : 'secondary'}>
            {tituloCopiado ?
                <><CopyCheck size={18} className="me-2" /> <span>Copiado</span></>
                : <><Copy size={18} className="me-2"  /> <span>Copiar</span></>}
        </Button>
    );
}