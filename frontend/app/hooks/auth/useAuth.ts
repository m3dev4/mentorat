import { AuthStateStore } from "~/api/auth/authStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi } from "~/utils/api/auth/authApi";
import type { User } from "~/types/authType";

export const useRegister = () => {
  const { login } = AuthStateStore();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      login(data.data.user, data.token, data.refreshToken);

      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
    },
  });
};

export const useLogin = () => {
  const { login } = AuthStateStore();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.data.user, data.token, data.refreshToken);

      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
    },
  });
};

export const useLogout = () => {
  const { logout } = AuthStateStore();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
  });
};

export const useGetMe = () => {
  const { setUser } = AuthStateStore();
  return useQuery({
    queryKey: ["me"],
    queryFn: authApi.getMe,
    onSuccess: (data: { status: string; data: { user: User } }) => {
      setUser(data.data.user);
    },
    enabled: !!localStorage.getItem("token"),
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: authApi.verifyEmail,
  });
};

export const useUpdateProfile = () => {
  const { setUser } = AuthStateStore();

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (data) => {
      setUser(data.data.user);
    },
  });
};

export const useUpdatePassword = () => {
  const { login } = AuthStateStore();

  return useMutation({
    mutationFn: authApi.updatePassword,
    onSuccess: (data) => {
      login(data.data.user, data.token, data.refreshToken);

      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
    },
  });
};
