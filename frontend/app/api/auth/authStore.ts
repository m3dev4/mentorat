import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type AuthState, type User } from "../../types/authType";

export const AuthStateStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      //Definition des actions
      setUser: (user) => set({ user }),
      setTokens: (token, refreshToken) => set({ token, refreshToken }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      //Action de register
      register: async (user: User) => set({}),

      //Action de login
      login: async (user, token, refreshToken) =>
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }),

      //Action de logout
      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,
      }),
    }
  )
);
