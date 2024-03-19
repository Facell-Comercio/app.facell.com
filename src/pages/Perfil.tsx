import { useAuthStore } from "@/context/auth-store";

const Perfil = () => {
   const user = useAuthStore(state=>state.user)
    return ( <div>
        <h1>Perfil</h1>
        <p>{user?.email}</p>
    </div> );
}
 
export default Perfil;