import authContext from "@/context/authProvider";
import { useContext } from "react";

const Home = () => {
    const {user} = useContext(authContext);

    return ( <div>
        <h1>Home</h1>
        <p>Hello, {user?.email}</p>
    </div> );
}
 
export default Home;