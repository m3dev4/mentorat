export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  isEmailVerified: boolean;
  profilePicture?: string;
}

//Definition du type pour l'etat d'authentification
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  //Actions
  setUser: (user: User | null) => void;
  setTokens: (token: string | null, refreshToken: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  register: (user: User) => void;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  stayConnected?: boolean;
}

export interface UpdateProfileRequest {
  bio?: string;
  location?: {
    country: string;
    city: string;
    isPublic?: boolean;
  };
  profilePicture?: string;
  languages?: Array<{
    language: string;
    level: "debutant" | "intermediaire" | "avance" | "natif";
  }>;
  timezone?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  status: string;
  token: string;
  refreshToken: string;
  data: {
    user: User;
  };
}
