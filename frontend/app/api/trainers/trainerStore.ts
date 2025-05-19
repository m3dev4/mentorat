import { create } from "zustand";
import type { TrainerFormData, TrainerState } from "~/types/trainerType";

const initialOnboardingData: TrainerFormData = {
  biography: "",
  specialization: [],
  certifications: [],
  presentationVideo: "",
  portfolio: [],
};

export const useTrainerStore = create<TrainerState>((set) => ({
  trainer: null,
  isTrainer: false,
  isloading: false,
  error: null,
  onboardingStep: 1,
  onboardingData: initialOnboardingData,

  setTrainer: (trainer) => set({ trainer }),
  setIsTrainer: (isTrainer) => set({ isTrainer }),
  setIsLoading: (isLoading) => set({ isloading: isLoading }),
  setError: (error) => set({ error }),

  resetTrainerState: () =>
    set({
      trainer: null,
      isTrainer: false,
      isloading: false,
      error: null,
    }),

  setOnboardigData: (data) =>
    set((state) => ({
      onboardingData: {
        ...state.onboardingData,
        ...data,
      },
    })),
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  resetOnboardingData: () => set({ onboardingData: initialOnboardingData }),
}));
