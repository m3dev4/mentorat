import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(8, {
        message: "Le mot de passe doit contenir au moins 8 caractères",
      })
      .max(100, {
        message: "Le mot de passe ne peut pas dépasser 100 caractères",
      })
      .regex(/[A-Z]/, {
        message: "Le mot de passe doit contenir au moins une lettre majuscule",
      })
      .regex(/[a-z]/, {
        message: "Le mot de passe doit contenir au moins une lettre minuscule",
      })
      .regex(/[0-9]/, {
        message: "Le mot de passe doit contenir au moins un chiffre",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mot de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  stayConnected: z.boolean().optional().default(false),
});


export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
