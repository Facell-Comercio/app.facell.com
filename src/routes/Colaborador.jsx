import { useParams, useNavigate } from "react-router-dom";

const Colab = () => {
    const {id} = useParams()
    const navigate = useNavigate()

    const handleContact = ()=>{
        console.log('Contato enviado');
        return navigate('/')
    }

    return ( <div>
        <h1>Colaborador {id}</h1>
        <button onClick={handleContact}>Enviar</button>
    </div> );
}
 
export default Colab;