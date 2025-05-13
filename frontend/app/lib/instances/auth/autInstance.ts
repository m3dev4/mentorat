import axios from "axios";

// Définition de l'URL de base de l'API
const API_URL = "http://localhost:5000/api/v1";

// Création de l'instance Axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Pour envoyer et recevoir des cookies
});

// Intercepteur pour ajouter le token d'authentification aux requêtes
axiosInstance.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem("token");

    // Si le token existe, l'ajouter aux headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et les erreurs
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est 401 (non autorisé) et que nous n'avons pas déjà tenté de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tentative de rafraîchissement du token
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Appel à l'API pour rafraîchir le token
        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        // Si la réponse est réussie, mettre à jour les tokens
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("refreshToken", response.data.refreshToken);

          // Mettre à jour le header de la requête originale et la renvoyer
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // En cas d'échec du rafraîchissement, déconnecter l'utilisateur
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        // Rediriger vers la page de connexion
        window.location.href = "/auth/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
