import { useContext } from 'react';
import authContext from '@/context/auth-provider';
import {Outlet, Navigate} from 'react-router-dom';

const PrivateRoutes = ()=>{
    const {user} = useContext(authContext);

    return (
        user ? <Outlet /> : <Navigate to="/login" />
    )
}

export default PrivateRoutes