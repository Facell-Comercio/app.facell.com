import {Outlet, Navigate} from 'react-router-dom';
import { useAuthStore } from '@/context/auth-store';

const PrivateRoutes = ()=>{
    const user = useAuthStore(state=>state.user);

    return (
        user ? <Outlet /> : <Navigate to="/login" />
    )
}

export default PrivateRoutes