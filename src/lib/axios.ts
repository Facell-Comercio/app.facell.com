// import { useAuthStore } from "@/context/auth-store";
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,
});

// Interceptador de requisição, para inclusão do token
api.interceptors.request.use((config) => {
  // Obtenha o token do localStorage
  const objectStorage = localStorage.getItem('auth-storage')
  // console.log(objectStorage);
  const json = objectStorage && JSON.parse(objectStorage)

  // const storageToken = useAuthStore.getState().token
  // const token = storageToken || null;
  const token = json && json.state && json.state.token
  
  // Se o token existir, adicione-o ao cabeçalho "Authorization"
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});