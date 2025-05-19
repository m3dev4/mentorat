import axios from "axios";
import type { Trainer, TrainerFormData } from "~/types/trainerType";

const apiUrl = "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-storage")
      ? JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state?.token
      : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Service pour les opérartion liées aux trainers
export const trainerService = {
  //Verifier si l'user est deja un trainer
  checkTrainerStatus: async () => {
    try {
      const response = await axiosInstance.get("/trainer/me");
      return {
        isTrainer: true,
        trainer: response.data,
      };
    } catch (error) {
      return {
        isTrainer: false,
        trainer: null,
      };
    }
  },

  //Recuperer les details du trainer
  getTrainerById: async (id: string): Promise<Trainer> => {
    const response = await axiosInstance.get(`/trainer/${id}`);
    return response.data;
  },

  // Récupérer les détails du trainer connecté
  getCurrentTrainer: async (): Promise<Trainer> => {
    const response = await axiosInstance.get("/trainer/me");
    return response.data;
  },

  //Creer un nouveau profiil du trainer
  createTrainer: async (trainerData: TrainerFormData): Promise<Trainer> => {
    const response = await axiosInstance.post("/trainer/become-trainer", trainerData);
    return response.data;
  },

  //Mettre à jour le profil du trainer
  updateTrainer: async (trainerData: TrainerFormData): Promise<Trainer> => {
    const response = await axiosInstance.put("/trainer/profile", trainerData);
    return response.data;
  },

  //Recuperer la liste des trainers
  getAllTrainer: async (
    params?: any
  ): Promise<{ trainers: Trainer[]; total: number; limit: number }> => {
    const response = await axiosInstance.get("/trainer", { params });
    return response.data;
  },
};
