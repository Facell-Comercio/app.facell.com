import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,
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
});
