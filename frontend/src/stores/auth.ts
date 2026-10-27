import { create } from "zustand"
import { persist } from "zustand/middleware"
import { apolloClient } from "@/lib/graphql/apollo"
import { LOGIN } from "@/lib/graphql/mutations/Login"
import { REGISTER } from "@/lib/graphql/mutations/Register"
import type { LoginInput, RegisterInput, User } from "@/types"

type AuthPayload = {
    token: string
    refreshToken: string
    user: User
}

type LoginMutationData = { login: AuthPayload }

type RegisterMutationData = { register: AuthPayload }

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    login: (data: LoginInput) => Promise<boolean>
    signup: (data: RegisterInput) => Promise<boolean>
    setUser: (user: User) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: async (loginData: LoginInput) => {
                const { data } = await apolloClient.mutate<
                    LoginMutationData,
                    { data: LoginInput }
                >({
                    mutation: LOGIN,
                    variables: { data: loginData },
                })

                if (!data?.login) return false

                const { user, token } = data.login
                set({ user, token, isAuthenticated: true })
                return true
            },
            signup: async (registerData: RegisterInput) => {
                const { data } = await apolloClient.mutate<
                    RegisterMutationData,
                    { data: RegisterInput }
                >({
                    mutation: REGISTER,
                    variables: { data: registerData },
                })

                if (!data?.register) return false

                const { user, token } = data.register
                set({ user, token, isAuthenticated: true })
                return true
            },
            setUser: (user: User) => {
                set({ user })
            },
            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                })
                apolloClient.clearStore()
            },
        }),
        {
            name: "auth-storage",
        },
    ),
)
