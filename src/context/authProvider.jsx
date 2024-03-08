import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/hooks/useApi";

const authContext = createContext();

export default authContext;

export const AuthProvider = ({ children }) => {
  const api = useApi();

  const navigate = useNavigate();

  const [token, setToken] = useState(prev=>prev = JSON.parse(localStorage.getItem("token") || null));
  const [user, setUser] = useState(prev=>prev = JSON.parse(localStorage.getItem("user") || null));

  const login = async ({ email, senha }) => {
    const data = await api.login({ email, senha });

    if (data.error) {
      return { error: true, message: data.error };
    }

    if (data?.user && data?.token) {
      setToken(data.token);
      console.log(data.user)
      setUser(data.user);
      localStorage.setItem("token", JSON.stringify(data.token));
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.setItem("token", "");
    localStorage.setItem("user", "");
  };

  const contextData = {
    login,
    logout,
    user,
  };

  return <authContext.Provider value={contextData}>{children}</authContext.Provider>;
};
