import { IUser } from '@/api/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware'

interface IAuthStore {
    user: IUser | null,
    token: string | null,
    isAuthenticate: boolean
    login: ({ user, token }: ILogin) => void,
    logout: () => void,
}

interface ILogin {
    user: IUser,
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