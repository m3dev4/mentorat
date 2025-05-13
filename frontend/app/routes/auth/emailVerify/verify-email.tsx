import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useVerifyEmail } from "../../../hooks/auth/useAuth";
import { Button } from "../../../components/ui/button";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Utiliser le hook de vérification d'email
  const verifyEmailMutation = useVerifyEmail();

  useEffect(() => {
    // Vérifier le token dès que le composant est monté
    if (token) {
      verifyEmail(token);
    } else {
      setVerificationStatus("error");
      setErrorMessage("Token de vérification manquant.");
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      await verifyEmailMutation.mutateAsync(verificationToken);
      setVerificationStatus("success");
    } catch (error: any) {
      setVerificationStatus("error");
      setErrorMessage(
        error.response?.data?.message ||
          "Une erreur est survenue lors de la vérification de l'email."
      );
    }
  };

  const handleGoToLogin = () => {
    navigate("/auth/login");
  };

  const handleGoToHome = () => {
    navigate("/");
  };

  if (verificationStatus === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
            Vérification de votre adresse email
          </h2>
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
          </div>
          <p className="mt-4 text-center text-gray-600">
            Veuillez patienter pendant que nous vérifions votre adresse email...
          </p>
        </div>
      </div>
    );
  }

  if (verificationStatus === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-center text-2xl font-bold text-red-600">
            Échec de la vérification
          </h2>
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <p className="text-center text-sm text-red-700">{errorMessage}</p>
          </div>
          <div className="flex flex-col gap-4">
            <Button
              onClick={handleGoToLogin}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Aller à la page de connexion
            </Button>
            <Button
              onClick={handleGoToHome}
              variant="outline"
              className="w-full"
            >
              Retourner à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-green-600">
          Vérification réussie !
        </h2>
        <div className="mb-6 rounded-md bg-green-50 p-4">
          <p className="text-center text-sm text-green-700">
            Votre adresse email a été vérifiée avec succès. Vous pouvez
            maintenant vous connecter à votre compte.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <Button
            onClick={handleGoToLogin}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Se connecter
          </Button>
          <Button onClick={handleGoToHome} variant="outline" className="w-full">
            Retourner à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
