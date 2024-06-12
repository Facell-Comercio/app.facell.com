import { useAuthStore } from "@/context/auth-store";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    api
      .get("auth/validar-token")
      .then(() => {
        const decodedToken = jwtDecode(token || "");
        // @ts-ignore
        login({ token: token || "", user: decodedToken.user });
      })
      .catch((error: AxiosError) => {
        logout();
        if (error.response?.status == 401) {
        } else {
          console.log("ERRO-PRIVATE-ROUTES-LOGIN-VALIDATE:", error);
        }
      });
  }, []);

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
