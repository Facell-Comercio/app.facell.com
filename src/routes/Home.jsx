import authContext from "@/context/authProvider";
import { useContext } from "react";

const Home = () => {
    const {user} = useContext(authContext);

    return ( <div className="p-5">
        <h1>Em breve...</h1>
        
    </div> );
}
 
export default Home;