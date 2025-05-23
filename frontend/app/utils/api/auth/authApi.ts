import axiosInstance from "../../../lib/instances/auth/autInstance";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdatePasswordRequest,
  UpdateProfileRequest,
  User,
} from "../../../types/authType";

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post("auth/register", data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post("auth/login", data);
    return response.data;
  },

  logout: async (): Promise<{ status: string; message: string }> => {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('token');
    
    // Configurer les en-têtes avec le token
    const config = {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      withCredentials: true, // Pour envoyer les cookies
    };
    
    const response = await axiosInstance.get<{
      status: string;
      message: string;
    }>("/auth/logout", config);
    
    // Supprimer les tokens du localStorage après la déconnexion
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    return response.data;
  },

  getMe: async (): Promise<{ status: string; data: { user: User } }> => {
    const response = await axiosInstance.get<{
      status: string;
      data: { user: User };
    }>("/auth/me");
    return response.data;
  },

  verifyEmail: async (
    token: string
  ): Promise<{ status: string; message: string }> => {
    const response = await axiosInstance.get<{
      status: string;
      message: string;
    }>(`/auth/verify-email/${token}`);
    return response.data;
  },

  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<{ status: string; data: { user: User } }> => {
    const response = await axiosInstance.put<{
      status: string;
      data: { user: User };
    }>("/auth/update-profile", data);
    return response.data;
  },

  updatePassword: async (
    data: UpdatePasswordRequest
  ): Promise<AuthResponse> => {
    const response = await axiosInstance.patch<AuthResponse>(
      "/auth/update-password",
      data
    );
    return response.data;
  },
};
