import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useTrainerStore } from "~/api/trainers/trainerStore";
import { trainerService } from "~/lib/instances/trainer/trainerInstance";
import type { TrainerFormData } from "~/types/trainerType";

export const trainerKeys = {
  all: ["trainer"] as const,
  lists: () => [...trainerKeys.all, "list"] as const,
  list: (filters: any) => [...trainerKeys.lists(), { filters }] as const,
  details: () => [...trainerKeys.all, "detail"] as const,
  detail: (id: string) => [...trainerKeys.details(), id] as const,
  me: () => [...trainerKeys.all, "me"] as const,
};

// Hook pour verifier si l'utilisateur est un trainer
export const useCheckTrainerStatus = () => {
  const { setTrainer, setIsTrainer, setIsLoading, setError } =
    useTrainerStore();

  return useQuery({
    queryKey: trainerKeys.me(),
    queryFn: async () => {
      setIsLoading(true);
      try {
        const result = await trainerService.checkTrainerStatus();
        setIsTrainer(result.isTrainer);
        setTrainer(result.trainer);
        return result;
      } catch (error: any) {
        setError(error.message || "Une erreur est survenue");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

// Hook pour recuperer les details du trainer
export const useTrainerById = (id: string) => {
  return useQuery({
    queryKey: trainerKeys.detail(id),
    queryFn: async () => trainerService.getTrainerById(id),
    enabled: !!id,
  });
};

// Hook pour recuperer le profil du trainer actuel
export const useCurrentTrainer = () => {
  const { setTrainer, setIsTrainer, setIsLoading, setError } =
    useTrainerStore();

  return useQuery({
    queryKey: trainerKeys.me(),
    queryFn: async () => {
      setIsLoading(true);
      try {
        const trainer = await trainerService.getCurrentTrainer();
        setTrainer(trainer);
        return trainer;
      } catch (error: any) {
        setError(error.message || "Une erreur est survenue");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
  });
};

// Hook pour creer un profil trainer
export const useCreateTrainer = () => {
  const {
    setTrainer,
    setIsTrainer,
    setError,
    setIsLoading,
    resetOnboardingData,
  } = useTrainerStore();

  return useMutation({
    mutationFn: async (trainerData: TrainerFormData) =>
      trainerService.createTrainer(trainerData),
    onMutate() {
      setIsLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      setTrainer(data);
      setIsTrainer(true);
      resetOnboardingData();
    },
  });
};
