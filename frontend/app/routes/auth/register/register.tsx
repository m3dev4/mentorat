import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  registerSchema,
  type RegisterFormValues,
} from "../../../validations/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "../../../hooks/auth/useAuth";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

const RegisterPage = () => {
  const navigate = useNavigate();

  //usestate
  const [serverError, setServerError] = useState<string | null>(null);
  const [verificationSent, setVeririficationSent] = useState(false);

  //Conf de react hook form avec zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useRegister();

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);

    try {
      await registerMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      setVeririficationSent(true);

      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Une erreur est survenue";
      setServerError(errorMessage);
    }
  };

  if (verificationSent) {
    return (
      <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Vérifiez votre email
          </h2>
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Inscription réussie</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        Un email de vérification a été envoyé à votre adresse email. Veuillez cliquer sur le lien dans l'email pour
                        activer votre compte.
                      </p>
                      <p className="mt-2">
                        Vous serez redirigé vers la page d'accueil dans quelques secondes...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Créer un nouveau compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{" "}
          <Link
            to="/auth/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            connectez-vous à votre compte existant
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-8 shadow sm:rounded-lg sm:px-10">
          {serverError && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 ">Erreur</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{serverError}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <Label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Prénom
                </Label>
                <div className="mt-1">
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    type="text"
                    autoComplete="given-name"
                    className={`block w-full appearance-none rounded-md border ${
                      errors.firstName ? "border-red-300" : "border-gray-300"
                    } px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nom
                </Label>
                <div className="mt-1">
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    type="text"
                    autoComplete="given-name"
                    className={`block w-full appearance-none rounded-md border ${
                      errors.lastName ? "border-red-300" : "border-gray-300"
                    } px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Adresse email
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  {...register("email")}
                  type="text"
                  autoComplete="given-name"
                  className={`block w-full appearance-none rounded-md border ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  } px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe
              </Label>
              <div className="mt-1">
                <Input
                  id="password"
                  {...register("password")}
                  type="text"
                  autoComplete="given-name"
                  className={`block w-full appearance-none rounded-md border ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  } px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmation du mot de passe
              </Label>
              <div className="mt-1">
                <Input
                  id="confirmPassword"
                  {...register("confirmPassword")}
                  type="text"
                  autoComplete="given-name"
                  className={`block w-full appearance-none rounded-md border ${
                    errors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  } px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Button
                type="submit"
                disabled={isSubmitting || registerMutation.isPending}
                className="flex w-full justify-center rounded-md border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 "
              >
                {isSubmitting || registerMutation.isPending
                  ? "Inscription en cours..."
                  : "S'inscrire"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
