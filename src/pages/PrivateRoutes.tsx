import { useAuthStore } from "@/context/auth-store";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    api
      .get("auth/validar-token")
      .then((data:any) => {
       const token = data?.data?.token || null;
        if(!token){
          logout();
        }
        const decodedToken = jwtDecode(token || "");
        // @ts-ignore
        login({ token: token || "", user: decodedToken.user });
      })
      .catch((error: AxiosError) => {
        // console.log('Erro em validação');
        // console.log(error);
        // console.log(localStorage.getItem('auth-storage'));
        
        if (error.response?.status == 401) {
          // console.log(error.message);
          
        } else {
          console.log("ERRO-PRIVATE-ROUTES-LOGIN-VALIDATE:", error);
        }
        logout();
      });
  }, []);

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
