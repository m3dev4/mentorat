import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useLogin } from "../../../hooks/auth/useAuth";
import { loginSchema, type LoginFormValues } from "../../../validations/auth";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      stayConnected: false,
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);

    try {
      await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
        stayConnected: data.stayConnected,
      });
      navigate("/");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Une erreur est survenue";
      setServerError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Se connecter
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ou{" "}
          <Link
            to="/auth/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            inscrivez-vous
          </Link>
        </p>
      </div>

      <div className="mt-8 mx-auto sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {serverError && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{serverError}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Adresse email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                autoCorrect="off"
                {...register("email")}
                className={`mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                  errors.email ? "border-red-300" : ""
                }`}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="password"
                autoCorrect="off"
                {...register("password")}
                className={`mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                  errors.password ? "border-red-300" : ""
                }`}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center">
                <Input
                  type="checkbox"
                  id="stayConnected"
                  {...register("stayConnected")}
                  className="h-4 w-4 rounded border-gray-300 cursor-pointer text-indigo-600 focus:ring-indigo-500"
                />
                <Label
                  htmlFor="stayConnected"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Se souvenir de moi
                </Label>
              </div>
              <div className="text-sm">
                <Link
                  to="/auth/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>
            <Button
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
              type="submit"
              disabled={isSubmitting || loginMutation.isPending}
            >
              {isSubmitting || loginMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
