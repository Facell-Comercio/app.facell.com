import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,
});

// Crie um interceptor de requisição
api.interceptors.request.use((config) => {
  // Obtenha o token do localStorage
  const token = JSON.parse(localStorage.getItem("token"));
  // Se o token existir, adicione-o ao cabeçalho "Authorization"
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

export const useApi = () => ({
  validateToken: async (token) => {
    try {
      const response = await api.post("/auth/validate", { token });
      return response.data;
    } catch (error) {
      return;
    }
  },
  login: async ({ email, senha }) => {
    try {
      const response = await api.post("/auth/login", { email, senha });
      console.log(response.data)
      return response.data;

    } catch (error) {
      return {error: error.message};
    }
  },
  logout: async () => {},
  financeiro: {
    contasPagar: {
      fetchTitulos: async (pagination)=>{
          const response = await api.get("/financeiro/contas-a-pagar/titulos", {params: {...pagination}});
          return response.data;
       
      }
    }
  }
});
