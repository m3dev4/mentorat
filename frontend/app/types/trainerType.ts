import type { VericationStatus } from "~/enum/vericationStatus";
import type { User } from "./authType";

export type SpecializationLevel =
  | "débutant"
  | "intermédiaire"
  | "avancé"
  | "expert";

export type PaymentMethod = "paypal" | "wave" | "orangeMoney" | "stripe";

export interface Specialization {
  domain: string;
  level: SpecializationLevel;
  yearsOfExperience: number;
}

export interface Certification {
  name: string;
  issuer: string;
  year: number;
  verificationUrl: string;
  verified: boolean;
}

export interface PortfolioItem {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  year: number;
}

export interface AvailabilitySchedule {
  [day: string]: Array<{
    startTime: string;
    endTime: string;
  }>;
}

export interface MentoringSession {
  duration: number;
  priceSession: number;
}

export interface Availability {
  schedule: AvailabilitySchedule;
  maxStudents: number;
  mentoringSession: MentoringSession;
}

export interface TrainerStats {
  totalStudents: number;
  totalReviews: number;
  avarageRating: number;
  responseRate: number;
  responseTime: number;
}

export interface BaknInfo {
  accountName: string;
  accountNumber: string;
  bankName: string;
  iban: string;
}

export interface TaxInfo {
  taxtId: string;
  country: string;
}

export interface PaymentInfo {
  paymentMethod: PaymentMethod;
  bankInfo: BaknInfo;
  taxInfo: TaxInfo;
  paypalEmail: string;
  stripeAccountId: string;
  waveAccountId: string;
  orangeMoneyNumber: string;
  orangeMoneyCountry: string;
}

export interface badge {
  name: string;
  desccription: string;
  imageUrl: string;
  awardedDate: string;
}

export interface TrainerPreference {
  notifyNewEnrolement: boolean;
  notifyNewReview: boolean;
  nortifyNewQuestion: boolean;
  notifyNewMentoringRequest: boolean;
}

export interface Trainer {
  _id?: string;
  user: string | User;
  biography?: string;
  specialization?: Specialization[];
  certifications?: Certification[];
  portfolio?: PortfolioItem[];
  presentationVideo?: string;
  availability?: Availability;
  courses: string[];
  stats: TrainerStats;
  paymentInfo?: PaymentInfo;
  verificationStatus?: VericationStatus;
  badge: badge[];
  preferences?: TrainerPreference;
  createdAt?: string;
  updatedAt?: string;
}

export interface TrainerFormData {
  biography?: string;
  specialization?: Specialization[];
  certifications?: Certification[];
  presentationVideo?: string;
  portfolio?: PortfolioItem[];
}

export interface TrainerState {
    //Etat du trainer pour l'utilisateur connecté
  trainer: Trainer | null;
  isTrainer: boolean;
  isloading: boolean;
  error: string | null;

  // Données de l'onboarding
  onboardingStep: number;
  onboardingData: TrainerFormData;

  // Actions
  setTrainer: (trainer: Trainer | null) => void;
  setIsTrainer: (isTrainer: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetTrainerState: () => void;

  setOnboardingStep: (step: number) => void;
  setOnboardigData: (data: Partial<TrainerFormData>) => void;
  resetOnboardingData: () => void;
}
