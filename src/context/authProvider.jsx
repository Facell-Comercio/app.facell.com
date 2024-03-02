import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/hooks/useApi";

const authContext = createContext();

export default authContext;

export const AuthProvider = ({ children }) => {
  const api = useApi();

  localStorage.getItem("token");

  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const login = async ({ email, senha }) => {
    const data = await api.login({ email, senha });

    if (data.error) {
      return { error: true, message: data.error };
    }

    if (data?.user && data?.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", JSON.stringify(data.token));
      navigate("/");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.setItem("token", "");
  };

  const contextData = {
    login,
    user,
  };

  return <authContext.Provider value={contextData}>{children}</authContext.Provider>;
};
