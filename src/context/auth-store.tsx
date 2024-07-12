import { UserCentroCusto, UserDepartamento, UserFilial, UserPermissao } from '@/types/user-type';
import { create } from 'zustand';
import { persist } from 'zustand/middleware'

export interface User {
    ativo: boolean
    email: string
    id: string
    img_url?: string
    nome: string
    filiais: UserFilial[]
    departamentos: UserDepartamento[]
    centros_custo: UserCentroCusto[]
    permissoes: UserPermissao[]
}

interface IAuthStore {
    user: User | null,
    token: string | null,
    isAuthenticate: boolean
    login: ({ user, token }: ILogin) => void,
    logout: () => void,
}

interface ILogin {
    user: User,
    token: string
}

export const useAuthStore = create(
    persist<IAuthStore>((set) => ({
        user: null,
        token: null,
        isAuthenticate: false,

        login: async ({ user, token }: ILogin) => {
            set({ user, token, isAuthenticate: true })
        },
        logout: () => {
            set({ user: null, token: null, isAuthenticate: false })
        }
    }),
        {
            name: 'auth-storage',
        }
    )
)