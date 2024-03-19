import { api } from "@/lib/axios";
import { AxiosError } from "axios";

export const validateToken = async (token: string | null) => {
  try {
    const response = await api.post("/auth/validate", { token });
    return response.data;
  } catch (error) {
    return;
  }
};

export interface IUser {
  ativo: number;
  email: string;
  id: string;
  id_grupo_economico: any;
  id_perfil: number;
  img_url: string;
  nivel_acesso: string;
  nome: string;
  perfil: string;
  roles: string;
}

export type TypeToken = string;

interface ILoginProps {
  email: string;
  senha: string;
}

interface ILoginSuccessResponse {
  user: IUser;
  token: TypeToken;
}

interface ILoginErrorResponse {
  error: AxiosError;
}
export const login = async ({ email, senha }: ILoginProps): Promise<ILoginSuccessResponse | ILoginErrorResponse> => {
  try {

    const result = await api.post("/auth/login", { email, senha });
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return { error };
    } else {
      throw error; // Re-throw any other error types
    }
  }
};
